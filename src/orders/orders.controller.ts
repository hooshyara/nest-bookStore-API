import { Controller, Get, Post, Body, Param, Request } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth('token')
@ApiTags('Orders - مدریت سفارش ها')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiOperation({ summary: 'ایجاد سفارش جدید' })
  @Post()
  create(@Body() creatOrderDto: CreateOrderDto) {
    return this.ordersService.create(creatOrderDto);
  }

  @ApiOperation({ summary: 'گرفتن سفارش کاربر' })
  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    const userId = req.user.userId;
    return this.ordersService.findOne(+id, userId);
  }

  @ApiOperation({ summary: 'لیست تمام سفارش های کاربر' })
  @Get()
  getAllOrders(@Request() req) {
    const userId = req.user.userId;
    return this.ordersService.getAllOrders(userId);
  }
}
