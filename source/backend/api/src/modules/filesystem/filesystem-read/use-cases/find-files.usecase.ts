import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { FileListQueryDto } from '#/modules/filesystem/dto/file-list-query.dto';
import type { FilePublicDto } from '#/modules/filesystem/dto/file-public.dto';
import type { FileDto } from '#/modules/filesystem/dto/file.dto';
import type { FilesListResponseDto } from '#/modules/filesystem/dto/files-list-response.dto';
import type { FolderDto } from '#/modules/filesystem/dto/folder.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import { FileEntity } from '#/modules/filesystem/entities/file.entity';
import { listPage } from '#/read/list-page';
import { PUBLIC_FILE } from '#/read/public';

/**
 * List public files.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of FileEntity); review it and add business rules here.
 */
@Injectable()
export class FindFilesUseCase {
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

  async execute(input: FileListQueryDto): Promise<FilesListResponseDto> {
    const { rows, meta } = await listPage(this.repository, input, PUBLIC_FILE);
    return { files: rows.map((entity) => this.toReadModel(entity)), meta } as unknown as FilesListResponseDto;
  }
}
