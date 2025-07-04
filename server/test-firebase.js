// server/test-firebase.js
import { storage, STORAGE_CONFIG } from './config/firebase.js';
import { ref, listAll } from 'firebase/storage';

const testFirebaseConnection = async () => {
  try {
    console.log('🔥 Testing Firebase Storage connection...');
    console.log('📦 Storage bucket:', storage.app.options.storageBucket);
    
    // Test bằng cách list files trong root folder
    const rootRef = ref(storage);
    const result = await listAll(rootRef);
    
    console.log('✅ Firebase Storage connected successfully!');
    console.log('📁 Found folders:', result.prefixes.map(folder => folder.name));
    console.log('📄 Found files in root:', result.items.map(item => item.name));
    
    // Test storage config
    console.log('⚙️ Storage configuration:');
    console.log('  - Max file size:', STORAGE_CONFIG.maxFileSize / (1024 * 1024) + 'MB');
    console.log('  - Allowed types:', STORAGE_CONFIG.allowedTypes.join(', '));
    console.log('  - Products path:', STORAGE_CONFIG.productImagesPath);
    console.log('  - General uploads path:', STORAGE_CONFIG.generalUploadsPath);
    
    return true;
  } catch (error) {
    console.error('❌ Firebase connection failed:', error);
    console.error('🔍 Possible issues:');
    console.error('  - Check internet connection');
    console.error('  - Verify Firebase config in config/firebase.js');
    console.error('  - Ensure Firebase Storage is enabled');
    console.error('  - Check Storage Rules are published');
    
    return false;
  }
};

// Run test
testFirebaseConnection()
  .then(success => {
    if (success) {
      console.log('🎉 All tests passed! Firebase is ready to use.');
      process.exit(0);
    } else {
      console.log('💥 Tests failed! Please check the errors above.');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('💥 Unexpected error:', error);
    process.exit(1);
  });