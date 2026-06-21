import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const start = Date.now();
    const { method, originalUrl } = req;

    res.on('finish', () => {
      const duration = Date.now() - start;
      const statusCode = res.statusCode;

      console.log(
        `${new Date().toISOString()} | ${method} ${originalUrl} | Status: ${statusCode} | ${duration}ms `,
      );
    });

    next();
  }
}
