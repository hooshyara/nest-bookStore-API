import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateContactusDto {
  @ApiProperty({ example: 'علی رضایی' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({ example: '09123456789' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  mobile: string;

  @ApiPropertyOptional({ example: 'متن پیام...' })
  @IsString()
  @IsOptional()
  descriptions?: string;
}
