import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResourceEntity } from './resource.entity';
import { isLikelyMp3 } from './mp3-validate';

export class InvalidMp3Error extends Error {
  constructor() {
    super('INVALID_MP3');
  }
}

@Injectable()
export class ResourcesService {
  constructor(
    @InjectRepository(ResourceEntity)
    private readonly repo: Repository<ResourceEntity>,
  ) {}

  async createFromMulterFile(file: Express.Multer.File): Promise<ResourceEntity> {
    if (!file?.buffer || file.buffer.length === 0) {
      throw new InvalidMp3Error();
    }
    if (!isLikelyMp3(file.buffer)) {
      throw new InvalidMp3Error();
    }

    const entity = this.repo.create({
      data: file.buffer,
      filename: file.originalname ?? 'upload.mp3',
      mimeType: file.mimetype ?? 'audio/mpeg',
      size: typeof file.size === 'number' ? file.size : file.buffer.length,
    });

    return this.repo.save(entity);
  }

  async list(): Promise<Array<Pick<ResourceEntity, 'id' | 'filename' | 'mimeType' | 'size' | 'createdAt'>>> {
    return this.repo.find({
      select: {
        id: true,
        filename: true,
        mimeType: true,
        size: true,
        createdAt: true,
      },
      order: { createdAt: 'DESC' },
    });
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await this.repo.delete({ id });
    return (result.affected ?? 0) > 0;
  }
}
