// ==========================================
// FILE: server/data/models/order.js - FIXED INDEX
// ==========================================
import mongoose from "mongoose";

let Schema = mongoose.Schema;
let String = Schema.Types.String;
let Number = Schema.Types.Number;

export const OrderSchema = new Schema(
  {
    orderNumber: {
      type: String,
      unique: true,  // ✅ CHỈ DÙNG unique: true, KHÔNG DÙNG index
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    customerInfo: {
      fullName: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      notes: String, // Ghi chú từ khách hàng
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipping', 'delivered', 'cancelled'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['cod', 'bank_transfer', 'vnpay'], // ✅ THÊM VNPAY
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
    confirmedAt: Date,
    processedAt: Date,
    shippedAt: Date,
    deliveredAt: Date,
    cancelledAt: Date,
    customerNotes: String,
    adminNotes: String,
    
    // ✅ THÊM CÁC FIELD CHO VNPAY
    vnpayData: {
      transactionNo: String,       // vnp_TransactionNo từ VNPay
      bankCode: String,           // vnp_BankCode - Mã ngân hàng
      cardType: String,           // vnp_CardType - Loại thẻ
      payDate: Date,              // vnp_PayDate - Thời gian thanh toán
      responseCode: String,       // vnp_ResponseCode - Mã phản hồi
      orderInfo: String,          // vnp_OrderInfo - Thông tin đơn hàng
      paymentUrl: String,         // URL thanh toán được tạo
      ipnReceived: Boolean,       // Đã nhận IPN hay chưa
      ipnReceivedAt: Date,        // Thời gian nhận IPN
      returnUrlAccessed: Boolean, // Khách hàng đã truy cập return URL
      returnUrlAccessedAt: Date,  // Thời gian truy cập return URL
    }
  },
  {
    collection: "orders",
    timestamps: true,
  }
);

// ✅ CHỈ DÙNG compound indexes, KHÔNG duplicate single field index
OrderSchema.index({ userId: 1, orderDate: -1 });
OrderSchema.index({ status: 1, orderDate: -1 });
OrderSchema.index({ 'vnpayData.transactionNo': 1 }); // Index cho VNPay transaction