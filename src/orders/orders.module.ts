import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-items.entity';
import { BooksModule } from 'src/books/books.module';
import { CartsModule } from 'src/carts/carts.module';
import { PaymentService } from './payment/payment.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    CartsModule,
    BooksModule,
    UserModule,
  ],

  controllers: [OrdersController],
  providers: [OrdersService, PaymentService],
  exports: [OrdersModule],
})
export class OrdersModule {}
