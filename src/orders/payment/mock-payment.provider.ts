import { PaymentProvider } from './payment.provider';

export class MockPaymentProvider implements PaymentProvider {
  async process(
    amount: number,
    userId: number,
  ): Promise<{ success: boolean; trackingCode: string }> {
    console.log(`پرداخت شبیه سازی شده کاربر شماره ${userId} با مبلغ ${amount}`);
    return { success: true, trackingCode: `MOK-${Date.now()}` };
  }
}
