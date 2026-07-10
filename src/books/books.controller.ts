import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  UseGuards,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { SearchBookDto } from './dto/search-book.dto';
import { RoleGuard } from 'src/auth/guard/role-auth.guard';
import { Role } from 'src/auth/decorators/roles.decorator';
import userRoleEnum from 'src/user/enum/userRoleEnum';
import { Public } from 'src/auth/decorators/public.decorators';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@ApiBearerAuth('token')
@ApiTags('Books - مدریت کتاب ها')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @ApiOperation({ summary: 'ایجاد کتاب جدید' })
  @UseGuards(RoleGuard)
  @Role(userRoleEnum.Admin, userRoleEnum.moderator)
  @Post()
  async create(@Body() createBookDto: CreateBookDto) {
    const new_book = await this.booksService.create(createBookDto);
    return {
      data: new_book,
      message: 'کتاب با موفقیت اضافه شد',
    };
  }

  @ApiOperation({ summary: 'لیست کتاب ها' })
  @Public()
  @ApiQuery({ name: 'title', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @Get()
  async findAll(
    @Query('title') title?: string,
    @Query('limit') limit: number = 10,
    @Query('page') page: number = 1,
  ) {
    const books = await this.booksService.findAll(title, limit, page);
    return {
      data: books,
    };
  }

  @ApiOperation({ summary: ' لیست کتاب ها' })
  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const book = await this.booksService.findOne(+id);
    return {
      data: book,
    };
  }

  @ApiOperation({ summary: ' دریافت کتاب' })
  @UseGuards(RoleGuard)
  @Role(userRoleEnum.Admin, userRoleEnum.moderator)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    const book = await this.booksService.update(+id, updateBookDto);
    return {
      data: book,
      message: 'کتاب با موفقیت ویرایش شد',
    };
  }

  @ApiOperation({ summary: 'ویرایش کتاب' })
  @UseGuards(RoleGuard)
  @Role(userRoleEnum.Admin, userRoleEnum.moderator)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const book = await this.booksService.remove(+id);
    return {
      data: book,
      message: 'کتاب با موفقیت حذف شد',
    };
  }

  @ApiOperation({ summary: ' حذف کتاب' })
  @Public()
  @Post('search')
  async searchBooks(@Body() searchBookDto: SearchBookDto) {
    const books = await this.booksService.search(searchBookDto);
    return {
      data: books,
    };
  }

  @ApiOperation({ summary: 'آپلود تصویر کتاب' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['image'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'تصویر با موفقیت آپلود شد',
    schema: {
      example: {
        message: 'Image uploaded successfully',
        imageUrl: '/uploads/books/1720000000000-123456789.jpg',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'فایل نامعتبر است یا ارسال نشده',
    schema: {
      example: {
        statusCode: 400,
        message: 'Only image files are allowed',
        error: 'Bad Request',
      },
    },
  })
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/books',
        filename: (req, file, cb) => {
          const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
          cb(null, fileName);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedExtensions = /jpg|jpeg|png|webp/;
        const ext = extname(file.originalname).toLowerCase();

        if (allowedExtensions.test(ext)) cb(null, true);
        else cb(new Error('Only image files are allowed'), false);
      },
      limits: {
        fileSize: 1024 * 1024 * 2,
      },
    }),
  )
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    return {
      message: 'Image uploaded successfully',
      imageUrl: `/uploads/books/${file.filename}`,
    };
  }
}
