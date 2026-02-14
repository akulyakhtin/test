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
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
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
