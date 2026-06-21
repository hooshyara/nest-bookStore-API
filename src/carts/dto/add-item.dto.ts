import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class AddItemDto {
  @ApiProperty({ example: 2, description: 'شناسه یکتای کتاب' })
  @IsInt({ message: 'آیدی کتاب باید عدد باشد' })
  @IsNotEmpty()
  bookId: number;

  @ApiProperty({ example: 3, description: 'تعداد محصول' })
  @IsInt({ message: ' تعداد محصول باید عدد باشد' })
  @Min(1)
  quantity: number;
}
