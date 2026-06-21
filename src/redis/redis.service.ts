import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  public readonly client: Redis;

  constructor() {
    this.client = new Redis({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT),
    });
  }

  onModuleDestroy() {
    this.client.quit();
  }

  async get(key: string) {
    return this.client.get(key);
  }
  async set(key: string, value: any, ttl?: number) {
    if (ttl) return this.client.set(key, JSON.stringify(value), 'EX', ttl);
    return this.client.set(key, JSON.stringify(value));
  }

  async del(key: string) {
    return this.client.del(key);
  }
}
