export interface PaymentProvider {
  process(
    amount: number,
    userId: number,
  ): Promise<{ success: boolean; trackingCode: string }>;
}
