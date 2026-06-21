import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Genres } from './entities/genre.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GenresService {
  constructor(
    @InjectRepository(Genres)
    private readonly genreRepository: Repository<Genres>,
  ) {}
  async create(createGenreDto: CreateGenreDto) {
    const existingGenre = await this.genreRepository.findOne({
      where: { name: createGenreDto.name },
    });
    if (existingGenre) throw new ConflictException('ژانر با این نام وجود دارد');

    const new_genre = this.genreRepository.create(createGenreDto);
    await this.genreRepository.save(new_genre);
    return new_genre;
  }

  findAll(name?: string, limit: number = 10, page: number = 1) {
    try {
      const query = this.genreRepository.createQueryBuilder('genres');

      if (name) {
        query.where('name = :x', { x: name });
      }
      query.skip((page - 1) * limit).take(limit);

      return query.getMany();
    } catch (error) {
      throw new BadRequestException(`error : ${error}`);
    }
  }

  findOne(id: number) {
    const genre = this.genreRepository.findOne({ where: { id } });
    if (!genre) throw new NotFoundException('ژانر مورد نظر پیدا نشد');
    return genre;
  }

  async update(id: number, updateGenreDto: UpdateGenreDto) {
    const genre = await this.genreRepository.findOneBy({ id });
    if (!genre) throw new NotFoundException();
    return await this.genreRepository.update(id, updateGenreDto);
  }

  async remove(id: number) {
    const genre = await this.genreRepository.findOneBy({ id });
    if (!genre) throw new NotFoundException();
    return await this.genreRepository.delete(id);
  }
}
