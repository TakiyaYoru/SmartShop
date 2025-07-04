import { gql } from '@apollo/client';

export const GET_VNPAY_BANKS = gql`
  query GetVnpayBanks {
    getVnpayBanks {
      bankCode
      bankName
    }
  }
`;

export const CREATE_VNPAY_PAYMENT_URL = gql`
  mutation CreateVnpayPaymentUrl($orderNumber: String!, $bankCode: String) {
    createVnpayPaymentUrl(orderNumber: $orderNumber, bankCode: $bankCode) {
      success
      paymentUrl
      orderNumber
      amount
      message
    }
  }
`;

export const HANDLE_VNPAY_RETURN = gql`
  mutation HandleVnpayReturn(
    $vnp_TxnRef: String!
    $vnp_Amount: String!
    $vnp_ResponseCode: String!
    $vnp_TransactionNo: String
    $vnp_BankCode: String
    $vnp_PayDate: String
    $vnp_SecureHash: String!
  ) {
    handleVnpayReturn(
      vnp_TxnRef: $vnp_TxnRef
      vnp_Amount: $vnp_Amount
      vnp_ResponseCode: $vnp_ResponseCode
      vnp_TransactionNo: $vnp_TransactionNo
      vnp_BankCode: $vnp_BankCode
      vnp_PayDate: $vnp_PayDate
      vnp_SecureHash: $vnp_SecureHash
    ) {
      success
      order {
        _id
        orderNumber
        totalAmount
        status
        paymentStatus
      }
      paymentInfo {
        transactionNo
        amount
        bankCode
        payDate
        responseCode
      }
      message
    }
  }
`;

export const formatVND = (amount) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

export const parseVnpayReturnParams = (search) => {
  const params = new URLSearchParams(search);
  return {
    vnp_TxnRef: params.get('orderNumber') || '',
    vnp_Amount: params.get('amount') || '',
    vnp_ResponseCode: params.get('responseCode') || '',
    vnp_TransactionNo: params.get('transactionNo') || '',
    vnp_BankCode: params.get('bankCode') || '',
    vnp_PayDate: params.get('payDate') || '',
    vnp_SecureHash: params.get('vnp_SecureHash') || ''
  };
};