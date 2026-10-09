import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ContactusService } from './contactus.service';
import { CreateContactusDto } from './dto/create-contactus.dto';
import { UpdateContactusDto } from './dto/update-contactus.dto';
import { Contactus } from './entities/contactus.entity';

@ApiTags('Contactus')
@ApiBearerAuth('access-token')
@Controller('contactus')
export class ContactusController {
  constructor(private readonly service: ContactusService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new contactus' })
  @ApiResponse({ status: 201, type: Contactus })
  async create(@Body() dto: CreateContactusDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all contactus' })
  @ApiResponse({ status: 200, description: 'List of contactus' })
  async findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a contactus by id' })
  @ApiResponse({ status: 200, type: Contactus })
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a contactus' })
  @ApiResponse({ status: 200, type: Contactus })
  async update(@Param('id') id: string, @Body() dto: UpdateContactusDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a contactus' })
  @ApiResponse({ status: 200, schema: { example: true } })
  async remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
