import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SongController } from './song.controller';
import { SongService } from './song.service';
import { SongEntity } from './song.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST ?? 'localhost',
      port: parseInt(process.env.DB_PORT ?? '5433'),
      username: process.env.DB_USERNAME ?? 'postgres',
      password: process.env.DB_PASSWORD ?? 'postgres',
      database: process.env.DB_NAME ?? 'song_db',
      entities: [SongEntity],
      synchronize: false,
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
