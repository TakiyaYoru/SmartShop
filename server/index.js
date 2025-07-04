import { createYoga } from "graphql-yoga";
import { schema } from "./graphql/schema.js";
import { useGraphQLMiddleware } from "@envelop/graphql-middleware";
import { permissions } from "./permissions.js";
import { db } from "./config.js";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

// VNPay Routes Import
import vnpayRoutes from './routes/vnpayRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

// Initialize database connection
import { initDatabase } from "./data/init.js";
await initDatabase();

const app = express();

// Middleware for VNPay
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS Middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:5173');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// VNPay Routes
app.use('/api/payment', vnpayRoutes);

// Serve static files from img directory
app.use('/img', express.static(path.join(__dirname, 'img')));

// Ensure img directory exists
const imgDir = path.join(__dirname, 'img');
if (!fs.existsSync(imgDir)) {
  fs.mkdirSync(imgDir, { recursive: true });
  console.log('📁 Created img directory:', imgDir);
}

// JWT Middleware
const getUser = (request) => {
  console.log('🔍 JWT Debug - Full request analysis:');
  console.log('  - Request URL:', request.url);
  console.log('  - Request method:', request.method);
  
  let authHeader = null;
  
  // Method 1: Standard headers
  if (request.headers) {
    authHeader = request.headers.authorization || request.headers.Authorization;
  }
  
  // Method 2: Headers as Map or Headers object
  if (!authHeader && request.headers && typeof request.headers.get === 'function') {
    authHeader = request.headers.get('authorization') || request.headers.get('Authorization');
  }
  
  // Method 3: Headers with _map property
  if (!authHeader && request.headers && request.headers._map) {
    authHeader = request.headers._map.authorization || request.headers._map.Authorization;
  }
  
  // Method 4: Iterate through all header properties
  if (!authHeader && request.headers) {
    for (const key in request.headers) {
      if (key.toLowerCase() === 'authorization') {
        authHeader = request.headers[key];
        break;
      }
    }
  }
  
  console.log('  - Authorization header:', authHeader || 'none');
  
  if (!authHeader) {
    return null;
  }

  if (!authHeader.startsWith('Bearer ')) {
    console.log('  - Invalid auth header format:', authHeader);
    return null;
  }

  const token = authHeader.replace('Bearer ', '');
  if (!token) {
    console.log('  - No token found in auth header');
    return null;
  }

  try {
    const jwtSecret = process.env.JWT_SECRET || 'SmartShopSuperSecret123';
    const decoded = jwt.verify(token, jwtSecret);
    // Map id -> _id if needed
    if (decoded.id && !decoded._id) decoded._id = decoded.id;
    console.log('  ✅ Decoded user:', { 
      _id: decoded._id, 
      username: decoded.username, 
      role: decoded.role
    });
    return decoded;
  } catch (error) {
    console.log('  ❌ JWT verification failed:', error.message);
    return null;
  }
};

// Create GraphQL server with context
const yoga = createYoga({
  schema,
  context: async ({ request }) => {
    const user = getUser(request);
    return {
      req: request,
      user,
      db
    };
  },
  plugins: [
    useGraphQLMiddleware([permissions])
  ],
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'authorization']
  },
  graphqlEndpoint: '/graphql',
  landingPage: false
});

// GraphQL endpoint
app.use('/graphql', yoga);

// Health check with VNPay status
app.get('/health', (req, res) => {
  const vnpayStatus = {
    configured: !!(process.env.VNP_TMN_CODE && process.env.VNP_HASH_SECRET),
    tmnCode: process.env.VNP_TMN_CODE || 'Not configured',
    returnUrl: process.env.VNP_RETURN_URL || 'Not configured',
    ipnUrl: process.env.VNP_IPN_URL || 'Not configured'
  };

  res.json({
    status: '✅ SmartShop server is healthy',
    mongodb: db.isConnected ? '✅ Connected' : '❌ Disconnected',
    vnpay: vnpayStatus,
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
    error: err.message
  });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 GraphQL endpoint: http://localhost:${PORT}/graphql`);
  console.log(`💳 VNPay IPN URL: http://localhost:${PORT}/api/payment/vnpay-ipn`);
  console.log(`🧪 VNPay Test URL: http://localhost:${PORT}/api/payment/test-vnpay`);
  console.log(`🖼️ Static images served at http://localhost:${PORT}/img`);
});