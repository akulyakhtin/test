import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Eureka } from 'eureka-js-client';
import * as os from 'os';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = parseInt(process.env.PORT ?? '3001');
  await app.listen(port);
  console.log(`Song service started on port ${port}`);

  const instanceHost = os.hostname();

  const eurekaClient = new Eureka({
    instance: {
      app: 'song-service',
      instanceId: `${instanceHost}:song-service:${port}`,
      hostName: instanceHost,
      ipAddr: instanceHost,
      port: { '$': port, '@enabled': 'true' },
      vipAddress: 'song-service',
      dataCenterInfo: {
        '@class': 'com.netflix.appinfo.MyDataCenterInfo',
        name: 'MyOwn',
      },
    },
    eureka: {
      host: process.env.EUREKA_HOST ?? 'localhost',
      port: parseInt(process.env.EUREKA_PORT ?? '8761'),
      servicePath: '/eureka/apps/',
      maxRetries: 10,
      requestRetryDelay: 2000,
    },
  });

  eurekaClient.start((error: Error) => {
    if (error) console.error('Eureka registration failed:', error);
  });

  process.on('SIGTERM', () => eurekaClient.stop());
  process.on('SIGINT', () => eurekaClient.stop());
}
bootstrap();
