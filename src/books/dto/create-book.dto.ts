import { ApiProperty } from '@nestjs/swagger';
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
  @IsString({ message: 'نام  باید رشته باشد' })
  title: string;

  @ApiProperty({ example: 'ali abasi', description: 'نام نویسنده' })
  @IsString({ message: 'نام نویسنده باید رشته باشد' })
  author: string;

  @ApiProperty({ example: 2005, description: 'سال انتشار' })
  @IsInt({ message: 'سال انتشار  باید عدد باشد' })
  @Min(1000)
  @Max(new Date().getFullYear() + 1)
  public_year: number;

  @ApiProperty({ example: 250000, description: ' قیمت' })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'قیمت  باید عدد باشد' })
  @Min(0, { message: 'قیمت نمیتواند منفی باشد' })
  price: number;

  @ApiProperty({example:"", description: ' عکس کتاب' })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({ example: 'lorem ....', description: 'توضیحات کتاب' })
  @IsString({ message: 'توضیحات باید رشته باشد' })
  @IsOptional()
  description: string;

  @ApiProperty({ example: [true, false], description: 'موجود بودن یا نبودن  ' })
  @IsBoolean()
  @IsOptional()
  isValid: boolean;

  @ApiProperty({ example: 2, description: 'شناسه یکتای ژانر' })
  @IsInt({ message: 'شناسه ژانر باید عدد باشد' })
  genre_id: number;
}
