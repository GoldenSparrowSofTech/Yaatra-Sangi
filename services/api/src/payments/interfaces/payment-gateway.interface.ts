export interface CreateOrderInput {
  bookingId: string;
  amount: number; // in INR
  currency?: string;
  receipt?: string;
  notes?: Record<string, string>;
}

export interface CreateOrderResult {
  orderId: string;
  amount: number;
  currency: string;
  provider: 'RAZORPAY' | 'MOCK';
  keyId?: string;
}

export interface VerifyPaymentInput {
  orderId: string;
  paymentId: string;
  signature: string;
}

export interface VerifyResult {
  isValid: boolean;
  orderId: string;
  paymentId: string;
  error?: string;
}

export interface RefundInput {
  paymentId: string;
  amount?: number;
  reason?: string;
}

export interface RefundResult {
  refundId: string;
  status: 'PROCESSED' | 'FAILED' | 'PENDING';
  amount: number;
}

export interface IPaymentGateway {
  createOrder(input: CreateOrderInput): Promise<CreateOrderResult>;
  verifyPayment(input: VerifyPaymentInput): Promise<VerifyResult>;
  refund(input: RefundInput): Promise<RefundResult>;
}

