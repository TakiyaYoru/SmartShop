// File: server/services/emailService.js (MOCK VERSION - NO NODEMAILER)

export const emailService = {
  async sendPasswordResetOTP(email, otp, userName) {
    // Mock email service - chỉ log ra console
    console.log('=== 📧 MOCK EMAIL SENT ===');
    console.log('📧 To:', email);
    console.log('👤 User:', userName);
    console.log('🔢 OTP:', otp);
    console.log('⏰ Valid for: 10 minutes');
    console.log('📄 Subject: SmartShop - Mã OTP đặt lại mật khẩu');
    console.log('💌 Content:');
    console.log(`
      Xin chào ${userName}!
      
      Mã OTP của bạn là: ${otp}
      
      Mã này có hiệu lực trong 10 phút.
      
      Trân trọng,
      Đội ngũ SmartShop
    `);
    console.log('=========================');
    
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return { 
      success: true, 
      messageId: 'mock-' + Date.now()
    };
  }
};