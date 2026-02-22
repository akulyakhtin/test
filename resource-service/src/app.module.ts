import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ResourcesController } from './resources.controller';
import { ResourcesService } from './resources.service';
import { ResourceEntity } from './resource.entity'

@Module({
  imports: [
    // TypeORM root config
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST ?? 'localhost',
      port: parseInt(process.env.DB_PORT ?? '5432'),
      username: process.env.DB_USERNAME ?? 'postgres',
      password: process.env.DB_PASSWORD ?? 'postgres',
      database: process.env.DB_NAME ?? 'postgres',
      entities: [ResourceEntity],
      synchronize: true, // dev only
    }),

    // Register repository for ResourceEntity
    TypeOrmModule.forFeature([ResourceEntity]),
  ],
  controllers: [
    ResourcesController,
  ],
  providers: [
    ResourcesService,
  ],
})
export class AppModule {}
