import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpStatus,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from 'express';
import userRoleEnum from './enum/userRoleEnum';
import { Role } from 'src/auth/decorators/roles.decorator';
import { RoleGuard } from 'src/auth/guard/role-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth('token')
@ApiTags('Users - مدریت کاربران')
@UseGuards(RoleGuard)
@Role(userRoleEnum.Admin)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'ایجاد کار بر جدید' })
  @Post()
  async create(@Res() res: Response, @Body() createUserDto: CreateUserDto) {
    await this.userService.create(createUserDto);
    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      data: createUserDto,
      message: 'Created Successfully !!',
    });
  }

  @ApiOperation({ summary: ' لیست کار بر ها' })
  @Get()
  async findAll(
    @Res() res: Response,
    @Query('role') role?: userRoleEnum,
    @Query('limit') limit: number = 10,
    @Query('page') page: number = 1,
  ) {
    const data = await this.userService.findAll(role, limit, page);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data,
    });
  }

  @ApiOperation({ summary: ' دریافت کار بر' })
  @Get(':id')
  async findOne(@Res() res: Response, @Param('id') id: string) {
    const data = await this.userService.findOne(+id);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data,
    });
  }

  @ApiOperation({ summary: ' ویرایش کار بر' })
  @Put('/:id')
  async update(
    @Res() res: Response,
    @Param('id') id: string,
    @Body() UpdateUserDto: UpdateUserDto,
  ) {
    await this.userService.update(+id, UpdateUserDto);
    return res.status(HttpStatus.ACCEPTED).json({
      statusCode: HttpStatus.ACCEPTED,
      data: UpdateUserDto,
      message: 'Updated Successfully !!',
    });
  }

  @ApiOperation({ summary: ' حذف کار بر' })
  @Delete(':id')
  async remove(@Res() res: Response, @Param('id') id: string) {
    const data = await this.userService.remove(+id);
    return res.status(HttpStatus.ACCEPTED).json({
      statusCode: HttpStatus.ACCEPTED,
      data,
      message: 'Deleted Successfully !!',
    });
  }
}
