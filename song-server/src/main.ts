import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? 3001
  await app.listen(port);
  console.log(`Song service started on port ${port}`)
}
bootstrap();
