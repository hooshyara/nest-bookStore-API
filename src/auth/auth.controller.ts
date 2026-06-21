import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { Public } from './decorators/public.decorators';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth('token')
@ApiTags('Authentications - احراز هویت')
@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'ثبت نام' })
  @Post()
  async register(@Res() res: Response, @Body() registerDto: RegisterDto) {
    await this.authService.register(registerDto);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,

      message: 'Register Successfully',
    });
  }

  @ApiOperation({ summary: 'ورود' })
  @Post('/login')
  async login(@Res() res: Response, @Body() loginDto: LoginDto) {
    const accessToken = await this.authService.login(loginDto);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      accessToken,
      message: 'Login Successfully',
    });
  }
}
