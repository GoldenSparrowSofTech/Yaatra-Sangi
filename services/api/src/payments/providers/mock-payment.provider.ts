import { Injectable } from '@nestjs/common';
import {
  CreateOrderInput,
  CreateOrderResult,
  IPaymentGateway,
  RefundInput,
  RefundResult,
  VerifyPaymentInput,
  VerifyResult,
} from '../interfaces/payment-gateway.interface.js';

@Injectable()
export class MockPaymentProvider implements IPaymentGateway {
  async createOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
    return {
      orderId: `order_mock_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      amount: input.amount,
      currency: input.currency || 'INR',
      provider: 'MOCK',
      keyId: 'rzp_test_mock_key',
    };
  }

  async verifyPayment(input: VerifyPaymentInput): Promise<VerifyResult> {
    // In mock mode, if signature starts with 'invalid', fail verification; otherwise succeed
    if (input.signature === 'invalid_sig' || !input.signature) {
      return {
        isValid: false,
        orderId: input.orderId,
        paymentId: input.paymentId,
        error: 'Invalid mock cryptographic signature',
      };
    }

    return {
      isValid: true,
      orderId: input.orderId,
      paymentId: input.paymentId,
    };
  }

  async refund(input: RefundInput): Promise<RefundResult> {
    return {
      refundId: `rfnd_mock_${Date.now()}`,
      status: 'PROCESSED',
      amount: input.amount || 0,
    };
  }
}

