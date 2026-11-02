import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { FilePublicDto } from '#/modules/filesystem/dto/file-public.dto';
import type { FileResponseDto } from '#/modules/filesystem/dto/file-response.dto';
import type { FileDto } from '#/modules/filesystem/dto/file.dto';
import type { FolderDto } from '#/modules/filesystem/dto/folder.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import { FileEntity } from '#/modules/filesystem/entities/file.entity';
import { PUBLIC_FILE } from '#/read/public';

/**
 * Get public files by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of FileEntity); review it and add business rules here.
 */
@Injectable()
export class GetFileByIdUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(FileEntity);
  }

  private toReadModel(entity: FileEntity): FilePublicDto {
    return {
    createdAt: entity.createdAt,
    currentVersionId: entity.currentVersionId,
    folderId: entity.folderId,
    id: entity.id,
    isLegalHold: entity.isLegalHold,
    name: entity.name,
    ownerAccountId: entity.ownerAccountId,
    status: entity.status,
    trashedAt: entity.trashedAt,
    updatedAt: entity.updatedAt,
    version: entity.version,
    visibility: entity.visibility,
    } as unknown as FilePublicDto;
  }

  async execute(input: { fileId: string }): Promise<FileResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.fileId, ...PUBLIC_FILE } as never);
    if (!entity) throw new NotFoundException('File not found');
    return {
      file: this.toReadModel(entity),
    } as unknown as FileResponseDto;
  }
}