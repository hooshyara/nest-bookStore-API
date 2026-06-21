import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import userRoleEnum from './enum/userRoleEnum';
import * as bcrypt from 'bcrypt';
import { CartsService } from 'src/carts/carts.service';

@Injectable()
export class UserService {
  constructor(
    private readonly cartServise: CartsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const hashPasseword = await bcrypt.hash(createUserDto.password, 10);
      const userData = {
        ...createUserDto,
        password: hashPasseword,
      };
      const new_user = this.userRepository.create(userData);
      const save_user = await this.userRepository.save(new_user);
      const create_cart = this.cartServise.create(save_user.id);
      return { user: save_user, cart: create_cart };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  findAll(role?: userRoleEnum, limit: number = 10, page: number = 1) {
    try {
      const query = this.userRepository.createQueryBuilder('users');

      if (role) {
        query.where('role = :x', { x: role });
      }
      query.skip((page - 1) * limit).take(limit);

      return query.getMany();
    } catch (error) {
      throw new BadRequestException(`error : ${error}`);
    }
  }

  async findOne(id: number) {
    return await this.userRepository.findOneBy({ id });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (user) {
        const updateUser = await this.userRepository.update(id, updateUserDto);
        return updateUser;
      } else {
        throw new NotFoundException('object not found !!');
      }
    } catch (error) {
      throw new BadRequestException(`error : ${error}`);
    }
  }

  async remove(id: number) {
    try {
      const user = await this.userRepository.findOneBy({ id });
      if (user) {
        const deleteUser = await this.userRepository.delete(id);
        return deleteUser;
      } else {
        throw new NotFoundException('object not found !!');
      }
    } catch (error) {
      throw new BadRequestException(`error : ${error}`);
    }
  }

  async findByMobile(mobile: string) {
    return this.userRepository.findOne({ where: { mobile } });
  }
}
