import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ResourcesModule } from './resources/resources.module';
import { ResourceEntity } from './resources/resource.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      entities: [ResourceEntity],
      synchronize: true, 
    }),

    ResourcesModule,
  ],
})
export class AppModule {}
