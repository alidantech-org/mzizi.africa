import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { FileVersionPublicDto } from '#/modules/filesystem/dto/file-version-public.dto';
import type { FileVersionResponseDto } from '#/modules/filesystem/dto/file-version-response.dto';
import type { FileVersionDto } from '#/modules/filesystem/dto/file-version.dto';
import type { FileDto } from '#/modules/filesystem/dto/file.dto';
import type { FolderDto } from '#/modules/filesystem/dto/folder.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import { FileVersionEntity } from '#/modules/filesystem/entities/file-version.entity';
import { OF_PUBLIC_FILE } from '#/read/public';

/**
 * Get versions of public files by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of FileVersionEntity); review it and add business rules here.
 */
@Injectable()
export class GetFileVersionByIdUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(FileVersionEntity);
  }

  private toReadModel(entity: FileVersionEntity): FileVersionPublicDto {
    return {
    createdAt: entity.createdAt,
    fileId: entity.fileId,
    id: entity.id,
    note: entity.note,
    objectId: entity.objectId,
    updatedAt: entity.updatedAt,
    uploadedBy: entity.uploadedBy,
    version: entity.version,
    versionNumber: entity.versionNumber,
    } as unknown as FileVersionPublicDto;
  }

  async execute(input: { versionId: string }): Promise<FileVersionResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.versionId, ...OF_PUBLIC_FILE } as never);
    if (!entity) throw new NotFoundException('FileVersion not found');
    return {
      version: this.toReadModel(entity),
    } as unknown as FileVersionResponseDto;
  }
}