import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { FileVersionListQueryDto } from '#/modules/filesystem/dto/file-version-list-query.dto';
import type { FileVersionPublicDto } from '#/modules/filesystem/dto/file-version-public.dto';
import type { FileVersionDto } from '#/modules/filesystem/dto/file-version.dto';
import type { FileVersionsListResponseDto } from '#/modules/filesystem/dto/file-versions-list-response.dto';
import type { FileDto } from '#/modules/filesystem/dto/file.dto';
import type { FolderDto } from '#/modules/filesystem/dto/folder.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import { FileVersionEntity } from '#/modules/filesystem/entities/file-version.entity';
import { listPage } from '#/read/list-page';
import { OF_PUBLIC_FILE } from '#/read/public';

/**
 * List versions of public files.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of FileVersionEntity); review it and add business rules here.
 */
@Injectable()
export class FindFileVersionsUseCase {
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

  async execute(input: FileVersionListQueryDto): Promise<FileVersionsListResponseDto> {
    const { rows, meta } = await listPage(this.repository, input, OF_PUBLIC_FILE);
    return { versions: rows.map((entity) => this.toReadModel(entity)), meta } as unknown as FileVersionsListResponseDto;
  }
}
