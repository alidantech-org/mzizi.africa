import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import type { StructureFileListQueryDto } from '#/modules/website/dto/structure-file-list-query.dto';
import type { StructureFilePublicDto } from '#/modules/website/dto/structure-file-public.dto';
import type { StructureFileDto } from '#/modules/website/dto/structure-file.dto';
import type { StructureFilesListResponseDto } from '#/modules/website/dto/structure-files-list-response.dto';
import type { StructureVersionDto } from '#/modules/website/dto/structure-version.dto';
import type { StructureDto } from '#/modules/website/dto/structure.dto';
import { StructureFileEntity } from '#/modules/website/entities/structure-file.entity';
import { listPage } from '#/read/list-page';

/**
 * List files of structure versions.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of StructureFileEntity); review it and add business rules here.
 */
@Injectable()
export class FindStructureFilesUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(StructureFileEntity);
  }

  private toReadModel(entity: StructureFileEntity): StructureFilePublicDto {
    return {
    createdAt: entity.createdAt,
    fileVersionId: entity.fileVersionId,
    id: entity.id,
    path: entity.path,
    role: entity.role,
    updatedAt: entity.updatedAt,
    version: entity.version,
    versionId: entity.versionId,
    } as unknown as StructureFilePublicDto;
  }

  async execute(input: StructureFileListQueryDto): Promise<StructureFilesListResponseDto> {
    const { rows, meta } = await listPage(this.repository, input);
    return { structureFiles: rows.map((entity) => this.toReadModel(entity)), meta } as unknown as StructureFilesListResponseDto;
  }
}
