import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateGenreDto {
  @ApiProperty({ example: 'علمی', description: 'نام ژانر' })
  @IsString({ message: 'نام  باید رشته باشد' })
  name: string;
}
