import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Eureka } from 'eureka-js-client';
import { setEurekaClient } from './eureka-client';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  const port = parseInt(process.env.PORT ?? '3000');
  await app.listen(port);
  console.log(`Resource service started on port ${port}`);

  const instanceHost = process.env.EUREKA_INSTANCE_HOST ?? 'localhost';

  const eurekaClient = new Eureka({
    instance: {
      app: 'resource-service',
      instanceId: `${instanceHost}:resource-service:${port}`,
      hostName: instanceHost,
      ipAddr: instanceHost,
      port: { '$': port, '@enabled': 'true' },
      vipAddress: 'resource-service',
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

  setEurekaClient(eurekaClient);
  eurekaClient.start((error: Error) => {
    if (error) console.error('Eureka registration failed:', error);
  });

  process.on('SIGTERM', () => eurekaClient.stop());
  process.on('SIGINT', () => eurekaClient.stop());
}

bootstrap();
