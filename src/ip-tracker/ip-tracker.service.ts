import { Injectable, BadRequestException } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class IpTrackerService {
  constructor(private redis: RedisService) {}
  private MAX_REQUESTS = 100;
  private WINDOW_SECONDS = 60;

  async track(ip: string) {
    const key = `rate:${ip}`;
    const reqCount = await this.redis.client.incr(key);

    if (reqCount === 1) {
      await this.redis.client.expire(key, this.WINDOW_SECONDS);
    }

    if (reqCount > this.MAX_REQUESTS) {
      throw new BadRequestException('Too many requests.');
    }
  }
}
