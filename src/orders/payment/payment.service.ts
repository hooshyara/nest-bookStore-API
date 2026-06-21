import { Injectable } from '@nestjs/common';
import { PaymentProvider } from './payment.provider';
import { MockPaymentProvider } from './mock-payment.provider';

@Injectable()
export class PaymentService {
  private provider: PaymentProvider;

  constructor() {
    this.provider = new MockPaymentProvider();
  }
  async processPayment(amount: number, userId: number) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return this.provider.process(amount, userId);
  }
}
