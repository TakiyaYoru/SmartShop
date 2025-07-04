// ==========================================
// FILE: server/test-vnpay-new.js - TEST SIMPLIFIED VNPAY SERVICE
// ==========================================

import dotenv from 'dotenv';
import vnpayService from './services/vnpayService.js';

// Load environment variables
dotenv.config();

// Mock request object
const mockReq = {
  headers: {
    'x-forwarded-for': '127.0.0.1',
    'x-real-ip': '127.0.0.1',
    'x-client-ip': '127.0.0.1'
  },
  ip: '127.0.0.1',
  connection: {
    remoteAddress: '127.0.0.1'
  }
};

async function testVNPayService() {
  console.log('🧪 Testing Simplified VNPay Service');
  console.log('====================================');

  try {
    // Test 1: Generate Order ID
    console.log('\n1️⃣ Testing Order ID Generation:');
    const orderId = vnpayService.generateOrderId();
    console.log('Generated Order ID:', orderId);

    // Test 2: Create Payment URL
    console.log('\n2️⃣ Testing Payment URL Creation:');
    const testOrderData = {
      orderNumber: orderId,
      amount: 50000, // 50,000 VND
      orderInfo: 'Test payment with simplified VNPay service - SmartShop',
      bankCode: '', // Không chọn ngân hàng cụ thể
      locale: 'vn'
    };

    console.log('Test Order Data:', testOrderData);

    const result = vnpayService.createPaymentUrl(mockReq, testOrderData);
    
    if (result.success) {
      console.log('✅ Payment URL created successfully!');
      console.log('Payment URL:', result.paymentUrl);
      console.log('VNPay Params:', result.vnp_Params);
    } else {
      console.log('❌ Failed to create payment URL:', result.error);
    }

    // Test 3: Get Bank List
    console.log('\n3️⃣ Testing Bank List:');
    try {
      const banks = await vnpayService.getBankList();
      console.log(`✅ Found ${banks.length} banks`);
      if (banks.length > 0) {
        console.log('Sample banks:', banks.slice(0, 3));
      }
    } catch (error) {
      console.log('❌ Failed to get bank list:', error.message);
    }

    // Test 4: Validate Order Data
    console.log('\n4️⃣ Testing Order Data Validation:');
    try {
      vnpayService.validateOrderData(testOrderData);
      console.log('✅ Order data validation passed');
    } catch (error) {
      console.log('❌ Order data validation failed:', error.message);
    }

    // Test 5: Test Invalid Order Data
    console.log('\n5️⃣ Testing Invalid Order Data:');
    const invalidOrderData = {
      orderNumber: '',
      amount: 500,
      orderInfo: ''
    };

    try {
      vnpayService.validateOrderData(invalidOrderData);
      console.log('❌ Should have failed validation');
    } catch (error) {
      console.log('✅ Correctly caught validation error:', error.message);
    }

    // Test 6: Format Currency
    console.log('\n6️⃣ Testing Currency Formatting:');
    const formattedAmount = vnpayService.formatCurrency(50000);
    console.log('Formatted amount:', formattedAmount);

    // Test 7: Test IPN Verification (Mock)
    console.log('\n7️⃣ Testing IPN Verification (Mock):');
    const mockIpnParams = {
      vnp_TxnRef: orderId,
      vnp_Amount: '5000000',
      vnp_ResponseCode: '00',
      vnp_TransactionStatus: '00',
      vnp_SecureHash: 'mock_hash'
    };
    
    const ipnResult = vnpayService.verifyIpnCall(mockIpnParams);
    console.log('IPN Verification Result:', ipnResult);

    console.log('\n🎉 All tests completed!');

  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
}

// Run the test
testVNPayService(); 