import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import userRoleEnum from 'src/user/enum/userRoleEnum';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.userService.findByMobile(
      registerDto.mobile,
    );
    if (existingUser)
      throw new ConflictException('کاربر  با این شماره موبایل وجود دارد .');

    const userData = {
      ...registerDto,
      role: userRoleEnum.NormalUser,
    };
    return this.userService.create(userData);
  }

  async login(loginDto: LoginDto) {
    const user = await this.userService.findByMobile(loginDto.mobile);
    if (!user) throw new NotFoundException('کاربر پیدا نشد');

    if (await bcrypt.compare(loginDto.password, user.password)) {
      const payload = {
        mobile: user.mobile,
        sub: user.id,
        name: user.name,
        role: user.role,
      };
      const token = this.jwtService.sign(payload);
      return {
        accessToken: token,
      };
    } else {
      throw new UnauthorizedException('شماره موبایل یا پسورد اشتباه است.');
    }
  }
}
