import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { CartsService } from './carts.service';
import { AddItemDto } from './dto/add-item.dto';
import { Public } from 'src/auth/decorators/public.decorators';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth('token')
@ApiTags('Carts - مدریت سبد خرید')
@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @ApiOperation({ summary: 'اضافه کردن آیتم به سبد خرید' })
  @Post()
  addItem(@Request() req, @Body() addItemdto: AddItemDto) {
    const userId = req.user.userId;
    return this.cartsService.addItem(userId, addItemdto);
  }

  @Public()
  @ApiOperation({ summary: 'سبد خرید کاربر' })
  @Get(':id')
  getUserCart(@Param('id') id: string) {
    return this.cartsService.getUserCart(+id);
  }

  @ApiOperation({ summary: 'حدف آینم از سبد خرید' })
  @Delete('item/:id')
  removeItemToCart(@Request() req, @Param('id') id: string) {
    const userId = req.user.userId;
    return this.cartsService.removeItemToCart(userId, +id);
  }

  @ApiOperation({ summary: 'خالی کردن سبد خرید' })
  @Delete('item')
  clearCart(@Request() req) {
    const userId = req.user.userId;
    return this.cartsService.clearCart(userId);
  }
}
