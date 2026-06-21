import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchBookDto {
  @ApiProperty({ example: 'book 1', description: 'نام کتاب' })
  @IsString({ message: 'نام  باید رشته باشد' })
  @IsOptional()
  title?: string;

  @ApiProperty({ example: 'ali abasi', description: 'نام نویسنده' })
  @IsString({ message: 'نام نویسنده باید رشته باشد' })
  @IsOptional()
  author?: string;

  @ApiProperty({ example: 2005, description: 'سال انتشار' })
  @IsInt({ message: 'سال انتشار  باید عدد باشد' })
  @Min(1000)
  @Max(new Date().getFullYear() + 1)
  @IsOptional()
  public_year?: number;

  @ApiProperty({ example: 2, description: 'شناسه یکتای ژانر' })
  @IsInt({ message: 'شناسه ژانر باید عدد باشد' })
  @IsOptional()
  genre_id?: number;

  @ApiProperty({ example: 2, description: 'شماره صفحه ' })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  page?: number = 1;

  @ApiProperty({ example: 2, description: 'تعداد کتاب ' })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  limit?: number = 10;
}
