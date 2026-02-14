import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { SongEntity } from './song.entity';
import { CreateSongDto } from './song.dto';

export class InvalidSongPayloadError extends Error {
  constructor(message: string) {
    super(message);
  }
}

@Injectable()
export class SongService {
  constructor(
    @InjectRepository(SongEntity)
    private readonly repo: Repository<SongEntity>,
  ) { }

  async create(dto: CreateSongDto): Promise<SongEntity> {

    console.log("creating song", dto);

    if (!dto.id || !dto.id.trim()) {
      throw new InvalidSongPayloadError('id is required');
    }

    const hasAny =
      !!dto.name?.trim() ||
      !!dto.artist?.trim() ||
      !!dto.album?.trim() ||
      !!dto.duration?.trim() ||
      !!dto.year?.trim();

    if (!hasAny) {
      throw new InvalidSongPayloadError('Empty song metadata');
    }

    if (dto.duration && !/^\d{2}:\d{2}$/.test(dto.duration.trim())) {
      throw new InvalidSongPayloadError('Invalid duration format. Expected MM:SS');
    }

    if (dto.year && !/^(19\d{2}|20\d{2})$/.test(dto.year.trim())) {
      throw new InvalidSongPayloadError('Invalid year format. Expected YYYY');
    }

    const entity = this.repo.create({
      id: dto.id.trim(),
      name: dto.name?.trim() ?? null,
      artist: dto.artist?.trim() ?? null,
      album: dto.album?.trim() ?? null,
      duration: dto.duration?.trim() ?? null,
      year: dto.year?.trim() ?? null,
    });

    return this.repo.save(entity);
  }

  async list(): Promise<Array<SongEntity>> {
    return this.repo.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<SongEntity | null> {
    return this.repo.findOne({ where: { id } });
  }

  async deleteByIds(ids: string[]): Promise<{ ids: string[] }> {
    if (ids.length === 0) return { ids: [] };

    // Fetch existing ids first so we can report exactly what was deleted
    const existing = await this.repo.find({
      select: { id: true },
      where: { id: In(ids) },
    });

    const existingIds = existing.map(x => x.id);

    await this.repo.delete({ id: In(existingIds) });

    return {
      ids: existingIds
    };
  }
}
