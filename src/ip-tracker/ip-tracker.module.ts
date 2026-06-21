import { Module } from '@nestjs/common';
import { IpTrackerService } from './ip-tracker.service';
import { IpTrackerController } from './ip-tracker.controller';
import { IpTracker } from './entities/ip-tracker.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([IpTracker])],
  controllers: [IpTrackerController],
  providers: [IpTrackerService],
  exports: [IpTrackerService],
})
export class IpTrackerModule {}
