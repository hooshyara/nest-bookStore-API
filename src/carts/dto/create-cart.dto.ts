import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateCartDto {
  @ApiProperty({ example: 2, description: 'شناسه یکتای کتاب' })
  @IsInt({ message: 'آیدی کاربر باید عدد باشد' })
  @IsNotEmpty()
  userId: number;
}
