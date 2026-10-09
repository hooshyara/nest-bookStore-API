import { Module, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { LoggerMiddleware } from './middleware/logger/logger.middleware';
import { OrdersModule } from './orders/orders.module';
import { User } from './user/entities/user.entity';
import { Order } from './orders/entities/order.entity';
import { APP_GUARD } from '@nestjs/core';
import { JtwAuthGuard } from './auth/guard/jwt-auth.guard';
import { BooksModule } from './books/books.module';
import { GenresModule } from './genres/genres.module';
import { CartsModule } from './carts/carts.module';
import { OrderItem } from './orders/entities/order-items.entity';
import { IpTrackerModule } from './ip-tracker/ip-tracker.module';
import { IpTrackerMiddleware } from './middleware/ip-tracker/ip-tracker.middleware';
import * as redisStore from 'cache-manager-ioredis';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisModule } from './redis/redis.module';
import { AppController } from './app.controller';
import { ContactusModule } from './contactus/contactus.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.register({
      store: redisStore,
      host: 'localhost',
      port: 6379,
      ttl: 3600, // زمان کش به ثانیه
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [User, Order, OrderItem],
      autoLoadEntities: true,
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    OrdersModule,
    BooksModule,
    GenresModule,
    CartsModule,
    IpTrackerModule,
    RedisModule,
    ContactusModule,
  ],
  providers: [
    AuthService,
    LoggerMiddleware,
    IpTrackerMiddleware,
    {
      provide: APP_GUARD,
      useClass: JtwAuthGuard,
    },
  ],
  controllers: [AppController],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware, IpTrackerMiddleware).forRoutes('*');
  }
}
