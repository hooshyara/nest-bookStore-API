import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  MaxLength,
} from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: '09156012626', description: 'شماره موبایل' })
  @IsString({ message: ' شماره موبایل باید رشته ای از اعداد باشد' })
  @IsNotEmpty()
  @Length(11, 11, { message: 'شماره موبایل باید ۱۱ رقم باشد' })
  @Matches(/^09[0-9]{9}$/, {
    message: 'فرمت شماره موبایل صحیح نیست (مثال: 09123456789)',
  })
  mobile: string;

  @ApiProperty({
    example: '1-9,a-z,A-Z,!,@,#,$,%,^,&,*,(,)',
    description: 'رمز عبور',
  })
  @IsString({ message: ' پسورد باید رشته باشد' })
  @MaxLength(16, { message: 'کلمه عبور از حد مجار طولانی تر است' })
  @IsNotEmpty()
  password: string;
}
