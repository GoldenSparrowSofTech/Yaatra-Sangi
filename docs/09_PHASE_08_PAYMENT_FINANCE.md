# Phase 08 — Payments, Commission & Refunds

Use gateway abstraction:
```ts
interface PaymentGateway {
  createOrder(input: CreateOrderInput): Promise<CreateOrderResult>;
  verifyPayment(input: VerifyPaymentInput): Promise<VerifyResult>;
  refund(input: RefundInput): Promise<RefundResult>;
}
```

Payment states:
CREATED, PENDING, SUCCESS, FAILED, REFUND_PENDING, REFUNDED, PARTIALLY_REFUNDED.

Webhook requirements:
signature verification, idempotency, replay safety, transaction safety.

Commission:
hotel commission, taxi commission, platform fee, taxes, provider payout.

Store financial snapshots with booking.

Refund tracks requested/approved amount, gateway reference, status.

Exit: hotel/taxi booking can safely complete quote → payment → webhook → confirmation → payout/refund.
