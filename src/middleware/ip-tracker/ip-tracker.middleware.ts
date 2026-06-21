import { Injectable, NestMiddleware } from '@nestjs/common';
import { IpTrackerService } from 'src/ip-tracker/ip-tracker.service';

@Injectable()
export class IpTrackerMiddleware implements NestMiddleware {
  constructor(private readonly ipTrackerService: IpTrackerService) {}
  async use(req: any, res: any, next: () => void) {
    await this.ipTrackerService.track(req.ip);
    next();
  }
}
