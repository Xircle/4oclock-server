import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { applyMiddleware } from './middleware';
import 'env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  applyMiddleware(app);
  await app.listen(8080, () => {
    process.send?.('ready');
  });

  process.on('SIGINT', () => {
    console.log('process exited');
    process.exit(0);
  });
}
bootstrap();
