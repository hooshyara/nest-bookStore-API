import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contactus } from './entities/contactus.entity';
import { CreateContactusDto } from './dto/create-contactus.dto';
import { UpdateContactusDto } from './dto/update-contactus.dto';

@Injectable()
export class ContactusService {
  constructor(
    @InjectRepository(Contactus)
    private readonly repository: Repository<Contactus>,
  ) {}

  async create(dto: CreateContactusDto): Promise<Contactus> {
    const entity = this.repository.create(dto);
    return this.repository.save(entity);
  }

  async findAll() {
    return this.repository.find();
  }

  async findOne(id: string): Promise<Contactus> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) {
      throw new NotFoundException('Contactus not found');
    }
    return entity;
  }

  async update(id: string, dto: UpdateContactusDto): Promise<Contactus> {
    await this.findOne(id);
    await this.repository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<boolean> {
    await this.findOne(id);
    await this.repository.delete(id);
    return true;
  }
}
