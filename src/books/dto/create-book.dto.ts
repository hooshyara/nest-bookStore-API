import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateBookDto {
  @ApiProperty({ example: 'book 1', description: 'نام کتاب' })
  @IsString({ message: 'نام باید رشته باشد' })
  title: string;

  @ApiProperty({ example: 'ali abasi', description: 'نام نویسنده' })
  @IsString({ message: 'نام نویسنده باید رشته باشد' })
  author: string;

  @ApiProperty({ example: 2005, description: 'سال انتشار' })
  @Type(() => Number)
  @IsInt({ message: 'سال انتشار باید عدد باشد' })
  @Min(1000, { message: 'سال انتشار نامعتبر است' })
  @Max(new Date().getFullYear() + 1, { message: 'سال انتشار نامعتبر است' })
  public_year: number;

  @ApiProperty({ example: 250000, description: 'قیمت' })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'قیمت باید عدد باشد' })
  @Min(0, { message: 'قیمت نمی‌تواند منفی باشد' })
  price: number;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    description: 'تصویر جلد کتاب',
  })
  @IsOptional()
  image?: any;

  @ApiPropertyOptional({
    example: 'lorem ....',
    description: 'توضیحات کتاب',
  })
  @IsOptional()
  @IsString({ message: 'توضیحات باید رشته باشد' })
  description?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'موجود بودن یا نبودن',
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === true || value === 'true' || value === '1' || value === 1) {
      return true;
    }
    if (value === false || value === 'false' || value === '0' || value === 0) {
      return false;
    }
    return value;
  })
  @IsBoolean({ message: 'وضعیت موجود بودن باید boolean باشد' })
  isValid?: boolean;

  @ApiProperty({ example: 2, description: 'شناسه یکتای ژانر' })
  @Type(() => Number)
  @IsInt({ message: 'شناسه ژانر باید عدد باشد' })
  genre_id: number;
}
