import express from 'express';
import * as vnpayService from '../services/vnpayService.js';
import { db } from '../config.js';

const router = express.Router();

// VNPay IPN endpoint
router.post('/vnpay-ipn', async (req, res) => {
  try {
    console.log('📥 Received VNPay IPN:', req.body);

    const vnp_Params = req.body;
    const verification = vnpayService.verifyIpnCall(vnp_Params);

    if (!verification.isValid) {
      console.error('❌ Invalid VNPay IPN signature');
      return res.json(vnpayService.createIpnResponse('97', 'Invalid signature'));
    }

    const paymentInfo = vnpayService.extractPaymentInfo(vnp_Params);
    const order = await db.orders.getByOrderNumber(paymentInfo.orderNumber);

    if (!order) {
      console.error('❌ Order not found for IPN:', paymentInfo.orderNumber);
      return res.json(vnpayService.createIpnResponse('01', 'Order not found'));
    }

    const updateData = {
      paymentStatus: verification.isSuccess ? 'paid' : 'failed',
      vnpayData: {
        ...order.vnpayData,
        transactionNo: paymentInfo.transactionNo,
        bankCode: paymentInfo.bankCode,
        cardType: paymentInfo.cardType,
        payDate: paymentInfo.payDate ? new Date(
          `${paymentInfo.payDate.substring(0, 4)}-${paymentInfo.payDate.substring(4, 6)}-${paymentInfo.payDate.substring(6, 8)}T${paymentInfo.payDate.substring(8, 10)}:${paymentInfo.payDate.substring(10, 12)}:${paymentInfo.payDate.substring(12, 14)}`
        ) : new Date(),
        responseCode: paymentInfo.responseCode,
        ipnReceived: true,
        ipnReceivedAt: new Date()
      }
    };

    if (verification.isSuccess && order.status === 'pending') {
      updateData.status = 'confirmed';
      updateData.confirmedAt = new Date();
    }

    await db.orders.updateById(order._id, updateData);
    console.log(`✅ Updated order ${paymentInfo.orderNumber} with IPN data`);

    return res.json(vnpayService.createIpnResponse('00', 'Confirm Success'));
  } catch (error) {
    console.error('❌ Error processing VNPay IPN:', error);
    return res.json(vnpayService.createIpnResponse('99', error.message));
  }
});

// VNPay Test endpoint
router.get('/test-vnpay', async (req, res) => {
  try {
    const orderData = {
      orderNumber: vnpayService.generateOrderId(),
      amount: 100000,
      orderInfo: 'Test VNPay Payment - SmartShop',
      bankCode: 'NCB'
    };

    const result = vnpayService.createPaymentUrl(req, orderData);
    if (!result.success) {
      return res.status(400).json({ success: false, message: result.error });
    }

    return res.json({
      success: true,
      paymentUrl: result.paymentUrl,
      orderNumber: orderData.orderNumber,
      amount: orderData.amount
    });
  } catch (error) {
    console.error('❌ Error testing VNPay:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;