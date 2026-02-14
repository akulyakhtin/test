import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SongController } from './song.controller';
import { SongService } from './song.service';
import { SongEntity } from './song.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      entities: [SongEntity],
      synchronize: true, // dev only
    }),

    // replaces SongsModule's TypeOrmModule.forFeature(...)
    TypeOrmModule.forFeature([SongEntity]),
  ],
  controllers: [
    SongController,
  ],
  providers: [
    SongService,
  ],
})
export class AppModule {}
