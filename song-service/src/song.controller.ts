import {
  Body,
  Controller,
  Post,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Get,
  Delete,
  Query,
} from '@nestjs/common';
import { CreateSongDto } from './song.dto';
import { SongService, InvalidSongPayloadError } from './song.service';

@Controller('songs')
export class SongController {
  constructor(private readonly songsService: SongService) {}

  @Post()
  async create(@Body() dto: CreateSongDto) {
    try {
      const saved = await this.songsService.create(dto);

      return {
        id: saved.id,
        createdAt: saved.createdAt,
      };
    } catch (err) {
      if (err instanceof InvalidSongPayloadError) {
        throw new BadRequestException(err.message);
      }
      throw new InternalServerErrorException();
    }
  }

    @Get()
  async list() {
    try {
      return await this.songsService.list();
    } catch {
      throw new InternalServerErrorException();
    }
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    try {
      const song = await this.songsService.findById(id);

      if (!song) {
        throw new NotFoundException();
      }
      return song;
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      }
      throw new InternalServerErrorException();
    }
  }

  @Delete()
  async deleteByIds(@Query('id') id: string | undefined) {
    try {
      if (!id || !id.trim()) {
        throw new BadRequestException('Query param "id" is required: /songs?id=<id1>,<id2>');
      }

      const ids = id
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      if (ids.length === 0) {
        throw new BadRequestException('No ids provided');
      }

      const result = await this.songsService.deleteByIds(ids);
      return result;

    } catch (err) {
      if (
        err instanceof BadRequestException ||
        err instanceof NotFoundException
      ) {
        throw err;
      }
      throw new InternalServerErrorException();
    }
  }
}
