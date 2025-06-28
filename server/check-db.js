// server/check-db-advanced.js - Advanced Database Connection Checker
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const DB_URI = process.env.MONGODB_URI || 'mongodb+srv://yorupj941:TakiyaYoru941@smartshop.w6pu139.mongodb.net/?retryWrites=true&w=majority&appName=SmartShop';

// Function to test connection with different SSL options
async function testConnectionWithOptions(optionsName, options) {
  console.log(`\n🧪 Testing connection with ${optionsName}...`);
  
  try {
    await mongoose.connect(DB_URI, options);
    console.log(`✅ SUCCESS with ${optionsName}!`);
    
    // Quick test
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log(`📁 Found ${collections.length} collections`);
    
    await mongoose.connection.close();
    return true;
  } catch (error) {
    console.log(`❌ FAILED with ${optionsName}`);
    console.log(`   Error: ${error.message.substring(0, 100)}...`);
    
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    return false;
  }
}

async function checkNetworkAndDNS() {
  console.log('\n🌐 Network & DNS Diagnostics:');
  
  try {
    // Test DNS resolution
    const dns = await import('dns');
    const { promisify } = await import('util');
    const lookup = promisify(dns.lookup);
    
    const hostname = 'smartshop.w6pu139.mongodb.net';
    const result = await lookup(hostname);
    console.log(`✅ DNS Resolution: ${hostname} → ${result.address}`);
  } catch (error) {
    console.log(`❌ DNS Resolution failed: ${error.message}`);
  }
  
  // Test basic connectivity
  try {
    const net = await import('net');
    const socket = new net.Socket();
    
    const testConnection = new Promise((resolve, reject) => {
      socket.setTimeout(5000);
      socket.on('connect', () => {
        console.log('✅ TCP Connection to MongoDB port successful');
        socket.destroy();
        resolve(true);
      });
      socket.on('timeout', () => {
        console.log('❌ TCP Connection timeout (port may be blocked)');
        socket.destroy();
        reject(new Error('Timeout'));
      });
      socket.on('error', (err) => {
        console.log(`❌ TCP Connection failed: ${err.message}`);
        reject(err);
      });
    });
    
    socket.connect(27017, 'smartshop.w6pu139.mongodb.net');
    await testConnection;
  } catch (error) {
    console.log(`❌ Network connectivity issue: ${error.message}`);
  }
}

async function checkEnvironment() {
  console.log('\n🔧 Environment Check:');
  console.log(`Node.js version: ${process.version}`);
  console.log(`Platform: ${process.platform}`);
  console.log(`Mongoose version: ${mongoose.version}`);
  
  // Check if we're behind a proxy
  const httpProxy = process.env.HTTP_PROXY || process.env.http_proxy;
  const httpsProxy = process.env.HTTPS_PROXY || process.env.https_proxy;
  
  if (httpProxy || httpsProxy) {
    console.log('🔍 Proxy detected:');
    if (httpProxy) console.log(`  HTTP_PROXY: ${httpProxy}`);
    if (httpsProxy) console.log(`  HTTPS_PROXY: ${httpsProxy}`);
  } else {
    console.log('📡 No proxy environment variables detected');
  }
}

async function checkDatabaseConnection() {
  console.log('🔍 Advanced MongoDB Atlas Connection Check...\n');
  
  await checkEnvironment();
  await checkNetworkAndDNS();
  
  console.log('\n🧪 Testing different connection configurations...');
  
  // Test configurations from most restrictive to most permissive
  const testConfigs = [
    {
      name: 'Default Modern Config',
      options: {
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        connectTimeoutMS: 10000,
        bufferCommands: false
      }
    },
    {
      name: 'Relaxed SSL Config',
      options: {
        serverSelectionTimeoutMS: 15000,
        socketTimeoutMS: 60000,
        connectTimeoutMS: 15000,
        bufferCommands: false,
        ssl: true,
        sslValidate: false
      }
    },
    {
      name: 'Minimal SSL Config',
      options: {
        serverSelectionTimeoutMS: 20000,
        socketTimeoutMS: 60000,
        connectTimeoutMS: 20000,
        bufferCommands: false,
        tls: true,
        tlsAllowInvalidCertificates: true,
        tlsAllowInvalidHostnames: true
      }
    },
    {
      name: 'Legacy Compatible Config',
      options: {
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS: 120000,
        connectTimeoutMS: 30000,
        bufferCommands: false,
        ssl: false
      }
    },
    {
      name: 'Minimal Config',
      options: {
        serverSelectionTimeoutMS: 30000
      }
    }
  ];
  
  let successfulConfig = null;
  
  for (const config of testConfigs) {
    const success = await testConnectionWithOptions(config.name, config.options);
    if (success) {
      successfulConfig = config;
      break;
    }
    
    // Wait a bit between attempts
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  if (successfulConfig) {
    console.log(`\n🎉 SUCCESS! Working configuration found: ${successfulConfig.name}`);
    console.log('\n📝 Add this to your main server config:');
    console.log('```javascript');
    console.log('const mongoOptions = ' + JSON.stringify(successfulConfig.options, null, 2) + ';');
    console.log('await mongoose.connect(DB_URI, mongoOptions);');
    console.log('```');
  } else {
    console.log('\n❌ All connection attempts failed!');
    console.log('\n🔥 This is likely a network/firewall issue:');
    console.log('1. Your WiFi/network is blocking MongoDB Atlas connections');
    console.log('2. MongoDB Atlas ports (27017, 27018, 27019) are blocked');
    console.log('3. SSL/TLS handshake is being interrupted by firewall');
    console.log('4. Your IP address needs to be whitelisted in MongoDB Atlas');
    
    console.log('\n💡 Try these solutions:');
    console.log('1. Use mobile hotspot to test');
    console.log('2. Connect from a different network');
    console.log('3. Add 0.0.0.0/0 to MongoDB Atlas IP whitelist (temporary)');
    console.log('4. Contact network administrator about MongoDB access');
    console.log('5. Use a VPN to bypass network restrictions');
  }
  
  console.log('\n🔒 Connection test completed.');
  process.exit(0);
}

// Test with alternative URI formats
async function testAlternativeURIs() {
  console.log('\n🔄 Testing alternative connection URIs...');
  
  const baseURI = 'smartshop.w6pu139.mongodb.net';
  const credentials = 'yorupj941:TakiyaYoru941';
  const dbName = 'SmartShop';
  
  const alternativeURIs = [
    `mongodb+srv://${credentials}@${baseURI}/${dbName}?retryWrites=true&w=majority`,
    `mongodb+srv://${credentials}@${baseURI}/${dbName}?ssl=true&retryWrites=true&w=majority`,
    `mongodb+srv://${credentials}@${baseURI}/${dbName}?ssl=false&retryWrites=true&w=majority`,
    `mongodb://${credentials}@${baseURI}:27017/${dbName}?ssl=true&replicaSet=atlas-123456-shard-0&authSource=admin&retryWrites=true&w=majority`
  ];
  
  for (let i = 0; i < alternativeURIs.length; i++) {
    console.log(`\nTesting URI format ${i + 1}...`);
    try {
      await mongoose.connect(alternativeURIs[i], {
        serverSelectionTimeoutMS: 10000
      });
      console.log(`✅ URI format ${i + 1} SUCCESS!`);
      await mongoose.connection.close();
      return;
    } catch (error) {
      console.log(`❌ URI format ${i + 1} failed: ${error.message.substring(0, 50)}...`);
      if (mongoose.connection.readyState === 1) {
        await mongoose.connection.close();
      }
    }
  }
}

// Run the advanced check
console.log('🚀 Advanced MongoDB Atlas Connection Diagnostics');
console.log('=================================================\n');

checkDatabaseConnection().catch((error) => {
  console.error('💥 Unexpected error:', error);
  process.exit(1);
});