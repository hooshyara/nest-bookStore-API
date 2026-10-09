import { Module } from '@nestjs/common';
import { ContactusService } from './contactus.service';
import { ContactusController } from './contactus.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contactus } from './entities/contactus.entity';

@Module({
  controllers: [ContactusController],
  providers: [ContactusService],
  imports: [TypeOrmModule.forFeature([Contactus])],
})
export class ContactusModule {}
