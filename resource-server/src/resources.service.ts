import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResourceEntity } from './resource.entity';
import { isLikelyMp3 } from './mp3-validate';
import { normalizeFromTika, TikaMetadata } from './tika-helper';

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
  ) { }

  async createFromMulterFile(file: Express.Multer.File): Promise<ResourceEntity> {
    if (!file?.buffer || file.buffer.length === 0) {
      throw new InvalidMp3Error();
    }
    if (!isLikelyMp3(file.buffer)) {
      throw new InvalidMp3Error();
    }

    const metadata: TikaMetadata = await this.extractMp3MetadataWithTika(file.buffer);
    const mp3Info = normalizeFromTika(metadata);
    console.log("mp3Info", mp3Info);

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

  private async extractMp3MetadataWithTika(buffer: Buffer): Promise<TikaMetadata> {
    const baseUrl = process.env.TIKA_URL || 'http://localhost:9998';

    // Tika supports returning metadata as JSON via /meta endpoint.
    // We'll POST the binary and ask for JSON.
    const res = await fetch(`${baseUrl}/meta`, {
      method: 'PUT',
      headers: {
        // Tika can auto-detect, but being explicit helps.
        'Content-Type': 'audio/mpeg',
        'Accept': 'application/json',
      },
      body: new Uint8Array(buffer),
    });

    if (!res.ok) {
      // Don’t fail the upload if metadata extraction fails? up to you.
      // Here we fail hard to make it obvious.
      const text = await this.safeReadText(res);
      throw new Error(`Tika metadata extraction failed: ${res.status} ${res.statusText} ${text}`);
    }

    // Tika returns JSON metadata; parse it.
    return (await res.json()) as TikaMetadata;
  }

  private async safeReadText(res: Response): Promise<string> {
    try {
      return await res.text();
    } catch {
      return '';
    }
  }
}
