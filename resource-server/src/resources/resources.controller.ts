import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { ResourcesService, InvalidMp3Error } from './resources.service'

@Controller('resources')
export class ResourcesController {
  constructor(
    private readonly resourcesService: ResourcesService,
  ) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 20 * 1024 * 1024, // 20 MB
      },
    }),
  )
  async upload(@UploadedFile() file: Express.Multer.File) {
    try {
      const saved = await this.resourcesService.createFromMulterFile(file);
      return {
        id: saved.id,
        filename: saved.filename,
        size: saved.size,
        mimeType: saved.mimeType,
      };
    } catch (err) {
      if (err instanceof InvalidMp3Error) {
        throw new BadRequestException('invalid mp3');
      }
      throw new InternalServerErrorException();
    }
  }
}
