import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Res,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GenresService } from './genres.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { Response } from 'express';
import { RoleGuard } from 'src/auth/guard/role-auth.guard';
import userRoleEnum from 'src/user/enum/userRoleEnum';
import { Role } from 'src/auth/decorators/roles.decorator';
import { Public } from 'src/auth/decorators/public.decorators';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

@ApiBearerAuth('token')
@ApiTags('Genres - مدریت ژانر ها')
@Controller('genres')
export class GenresController {
  constructor(private readonly genresService: GenresService) {}

  @ApiOperation({ summary: 'ایجاد ژانر جدید' })
  @UseGuards(RoleGuard)
  @Role(userRoleEnum.Admin, userRoleEnum.moderator)
  @Post()
  create(@Res() res: Response, @Body() createGenreDto: CreateGenreDto) {
    const new_genre = this.genresService.create(createGenreDto);
    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      data: new_genre,
      message: 'Created Successfully !!',
    });
  }

  @ApiQuery({ name: 'name', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @Public()
  @ApiOperation({ summary: 'لیست کل ژانر' })
  @Get()
  async findAll(
    @Res() res: Response,
    @Query('name') name?: string,
    @Query('limit') limit: number = 10,
    @Query('page') page: number = 1,
  ) {
    const genres = await this.genresService.findAll(name, limit, page);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: genres,
    });
  }

  @Public()
  @ApiOperation({ summary: 'گرفتن یک ژانر' })
  @Get('/:id')
  async findOne(@Res() res: Response, @Param('id') id: string) {
    const genre = await this.genresService.findOne(+id);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: genre,
    });
  }

  @UseGuards(RoleGuard)
  @ApiOperation({ summary: 'ویرایش ژانر ' })
  @Role(userRoleEnum.Admin, userRoleEnum.moderator)
  @Put(':id')
  async update(
    @Res() res: Response,
    @Param('id') id: string,
    @Body() updateGenreDto: UpdateGenreDto,
  ) {
    const genre = await this.genresService.update(+id, updateGenreDto);
    return res.status(HttpStatus.ACCEPTED).json({
      statusCode: HttpStatus.ACCEPTED,
      data: genre,
      message: 'Updated Successfully !!',
    });
  }

  @UseGuards(RoleGuard)
  @ApiOperation({ summary: 'حذف کتاب' })
  @Role(userRoleEnum.Admin, userRoleEnum.moderator)
  @Delete(':id')
  async remove(@Res() res: Response, @Param('id') id: string) {
    const genre = await this.genresService.remove(+id);
    return res.status(HttpStatus.ACCEPTED).json({
      statusCode: HttpStatus.ACCEPTED,
      data: genre,
      message: 'Deleted Successfully !!',
    });
  }
}
