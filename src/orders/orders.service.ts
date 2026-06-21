import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderStatusEnum } from './enums/order-status.enum';
import { Repository } from 'typeorm';
import { OrderItem } from './entities/order-items.entity';
import { BooksService } from 'src/books/books.service';
import { CartsService } from 'src/carts/carts.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { PaymentService } from './payment/payment.service';
import { UserService } from 'src/user/user.service';
import userRoleEnum from 'src/user/enum/userRoleEnum';

@Injectable()
export class OrdersService {
  private PREMIUM_USER_DISCOUNT: number = 10;
  constructor(
    private readonly bookService: BooksService,
    private readonly userService: UserService,
    private readonly cartService: CartsService,
    private readonly paymentService: PaymentService,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
  ) {}

  async create(creatOrderDto: CreateOrderDto) {
    const cart = await this.cartService.getUserCart(creatOrderDto.userId);
    if (!cart || cart.items.length === 0)
      throw new BadRequestException('سبد خرید شما خالی است');

    const order = this.orderRepository.create({
      user: { id: creatOrderDto.userId },
      status: OrderStatusEnum.pending,
      total_price: 0,
    });
    const saveOrder = await this.orderRepository.save(order);

    let totalAmount = 0;
    const order_items: OrderItem[] = [];

    for (const item of cart.items) {
      const book = item.book;
      const quantity = item.quantity;

      const item_total_amount = Number(book.price) * quantity;

      totalAmount += item_total_amount;

      const orderItem = this.orderItemRepository.create({
        order,
        book,
        quantity,
      });
      order_items.push(orderItem);
    }
    const user = await this.userService.findOne(creatOrderDto.userId);
    if (user.role === userRoleEnum.PremiumUser) {
      order.total_price =
        totalAmount - (totalAmount * this.PREMIUM_USER_DISCOUNT) / 100;
    } else {
      order.total_price = totalAmount;
    }

    await this.orderRepository.save(order);
    console.log(saveOrder);
    // try {
    //   await this.orderItemRepository.save(order_items);
    // } catch (error) {
    //   console.log(error);
    // }
    await this.orderItemRepository.save(order_items);
    const paymentResult = await this.paymentService.processPayment(
      totalAmount,
      creatOrderDto.userId,
    );
    if (paymentResult.success) {
      order.status = OrderStatusEnum.completed;
      await this.orderRepository.save(order);
      await this.cartService.clearCart(creatOrderDto.userId);
      return {
        message: 'خرید با موفقیت انجام شد',
        trackingCode: paymentResult.trackingCode,
        orderId: order.id,
      };
    } else {
      throw new BadRequestException('پرداخت ناموفق بود');
    }
  }

  async findOne(id: number, userId: number) {
    const user = await this.userService.findOne(userId);
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['user', 'items', 'items.book'],
    });
    if (user.id === order.user.id) {
      return order;
    } else {
      throw new UnauthorizedException();
    }
  }

  async getAllOrders(userId: number) {
    const order = await this.orderRepository.find({
      where: { user: { id: userId } },
      relations: ['user', 'items', 'items.book'],
    });
    if (order.length === 0) return { message: 'تا کنون سفارشی ثبت نشده است' };
    return order;
  }
}
