/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { GenresService } from 'src/genres/genres.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Repository } from 'typeorm';
import { SearchBookDto } from './dto/search-book.dto';
import { RedisService } from 'src/redis/redis.service';
import { unlink } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class BooksService {
  constructor(
    private readonly genresService: GenresService,
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    private redis: RedisService,
  ) {}

  private CACHE_KEY = 'books:all';

  async create(createBookDto: CreateBookDto, image?: Express.Multer.File) {
    const { genre_id, image: _imageFile, ...rest } = createBookDto as any;

    const genre = await this.genresService.findOne(genre_id);
    if (!genre) {
      if (image) {
        await unlink(
          join(process.cwd(), 'uploads/books', image.filename),
        ).catch(() => {});
      }
      throw new NotFoundException('شناسه یکتای ژانر موجود نیست');
    }

    const imageUrl = image ? `/uploads/books/${image.filename}` : null;

    const new_book = this.bookRepository.create({
      ...rest,
      imageUrl,
      genre,
    });

    let saved;
    try {
      saved = await this.bookRepository.save(new_book);
    } catch (err) {
      if (image) {
        await unlink(
          join(process.cwd(), 'uploads/books', image.filename),
        ).catch(() => {});
      }
      throw err;
    }

    await this.redis.del(this.CACHE_KEY);
    return saved;
  }

  async findAll(title?: string, limit: number = 10, page: number = 1) {
    const cached = await this.redis.get(this.CACHE_KEY);

    if (cached) return JSON.parse(cached);

    const query = this.bookRepository.createQueryBuilder('books');

    if (title) query.where('title = :x', { x: title });

    query.skip((page - 1) * limit).take(limit);
    query.leftJoinAndSelect('books.genre', 'genre');
    const books = await query.getMany();
    await this.redis.set(this.CACHE_KEY, books, 6);
    return books;
  }

  async findOne(id: number) {
    const book = await this.bookRepository.findOne({
      where: { id },
      relations: ['genre'],
    });
    if (!book) throw new NotFoundException('شناسه یکتای کتاب موجود نیست');
    return book;
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    const book = await this.bookRepository.findOne({ where: { id } });
    if (!book) throw new NotFoundException('شناسه یکتای کتاب موجود نیست');

    if (updateBookDto.genre_id) {
      const genre = await this.genresService.findOne(updateBookDto.genre_id);
      if (!genre) throw new NotFoundException('شناسه یکتای ژانر موجود نیست');
      book.genre = genre;
    }
    const { genre_id, ...data } = updateBookDto;
    console.log(genre_id);
    Object.assign(book, data);
    await this.redis.del(this.CACHE_KEY);
    return await this.bookRepository.save(book);
  }

  async remove(id: number) {
    const existingBook = await this.bookRepository.findOne({ where: { id } });
    if (!existingBook)
      throw new NotFoundException('شماسه یکتای کتاب موجود نیست');
    await this.redis.del(this.CACHE_KEY);
    return this.bookRepository.delete(id);
  }

  async search(searchBookingDto: SearchBookDto) {
    const {
      title,
      author,
      public_year,
      genre_id,
      page = 1,
      limit = 20,
    } = searchBookingDto;
    const query = this.bookRepository.createQueryBuilder('books');
    query.leftJoinAndSelect('books.genre', 'genre');

    if (title) {
      query.andWhere('books.title LIKE :title', { title: `%${title}%` });
    }
    if (author) {
      query.andWhere('books.author LIKE :author', { author: `%${author}%` });
    }
    if (public_year) {
      query.andWhere('books.public_year = :public_year', {
        public_year,
      });
    }
    if (genre_id) {
      query.andWhere('books.genre_id = :genre_id', {
        genre_id,
      });
    }
    query.skip((page - 1) * limit).take(limit);
    query.orderBy('books.id', 'DESC');
    return await query.getMany();
  }
}
