import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
} from 'class-validator';
import userRoleEnum from '../enum/userRoleEnum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: '09151234567', description: 'شماره موبایل' })
  @IsString({ message: 'شماره موبایل باید رشته ای از اعداد باشد.' })
  @IsNotEmpty()
  @Length(11, 11, { message: 'شماره موبایل باید ۱۱ رقم باشد' })
  @Matches(/^09[0-9]{9}$/, {
    message: 'فرمت شماره موبایل صحیح نیست (مثال: 09123456789)',
  })
  mobile: string;

  @ApiProperty({ example: 'ali', description: 'نام' })
  @IsString({ message: 'نام  باید رشته باشد' })
  @IsNotEmpty({ message: 'نام  نمی‌تواند خالی باشد' })
  @Length(3, 50, { message: 'نام  باید بین ۳ تا ۵۰ کاراکتر باشد' })
  name: string;

  @ApiProperty({
    example: '1-9,a-z,A-Z,!,@,#,$,%,^,&,*,(,)',
    description: 'رمز عبور',
  })
  @IsString({ message: ' پسورد باید رشته باشد' })
  @MaxLength(16, { message: 'کلمه عبور از حد مجار طولانی تر است' })
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: userRoleEnum, description: 'نقش کاربری' })
  @IsEnum(userRoleEnum)
  @IsOptional()
  role: userRoleEnum;
}
