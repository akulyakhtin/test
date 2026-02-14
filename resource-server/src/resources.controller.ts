import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { ResourcesService, InvalidMp3Error } from './resources.service';

@Controller('resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
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

  @Get()
  async list() {
    try {
      return await this.resourcesService.list();
    } catch {
      throw new InternalServerErrorException();
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    try {
      const deleted = await this.resourcesService.deleteById(id);
      if (!deleted) throw new NotFoundException();
      return { deleted: true };
    } catch (err) {
      if (err instanceof NotFoundException) throw err;
      throw new InternalServerErrorException();
    }
  }
}
