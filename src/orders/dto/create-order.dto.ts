// src/orders/dto/create-order.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({ example: 2, description: 'شناسه یکتای کاربر' })
  @IsNumber()
  @IsNotEmpty()
  userId: number;
}
