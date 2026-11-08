import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { FolderListQueryDto } from '#/modules/filesystem/dto/folder-list-query.dto';
import type { FolderPublicDto } from '#/modules/filesystem/dto/folder-public.dto';
import type { FolderDto } from '#/modules/filesystem/dto/folder.dto';
import type { FoldersListResponseDto } from '#/modules/filesystem/dto/folders-list-response.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import { FolderEntity } from '#/modules/filesystem/entities/folder.entity';
import { listPage } from '#/read/list-page';
import { PUBLIC_FOLDER } from '#/read/public';

/**
 * List public folders.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of FolderEntity); review it and add business rules here.
 */
@Injectable()
export class FindFoldersUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(FolderEntity);
  }

  private toReadModel(entity: FolderEntity): FolderPublicDto {
    return {
    createdAt: entity.createdAt,
    depth: entity.depth,
    id: entity.id,
    name: entity.name,
    parentId: entity.parentId,
    path: entity.path,
    updatedAt: entity.updatedAt,
    version: entity.version,
    visibility: entity.visibility,
    } as unknown as FolderPublicDto;
  }

  async execute(input: FolderListQueryDto): Promise<FoldersListResponseDto> {
    const { rows, meta } = await listPage(this.repository, input, PUBLIC_FOLDER);
    return { folders: rows.map((entity) => this.toReadModel(entity)), meta } as unknown as FoldersListResponseDto;
  }
}
