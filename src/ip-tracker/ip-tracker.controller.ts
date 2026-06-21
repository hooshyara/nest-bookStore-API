import { Controller } from '@nestjs/common';
import { IpTrackerService } from './ip-tracker.service';

@Controller('ip')
export class IpTrackerController {
  constructor(private readonly ipTrackerService: IpTrackerService) {}
}
