import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import type { StructureVersionListQueryDto } from '#/modules/website/dto/structure-version-list-query.dto';
import type { StructureVersionPublicDto } from '#/modules/website/dto/structure-version-public.dto';
import type { StructureVersionDto } from '#/modules/website/dto/structure-version.dto';
import type { StructureVersionsListResponseDto } from '#/modules/website/dto/structure-versions-list-response.dto';
import type { StructureDto } from '#/modules/website/dto/structure.dto';
import { StructureVersionEntity } from '#/modules/website/entities/structure-version.entity';
import { listPage } from '#/read/list-page';

/**
 * List structure versions.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of StructureVersionEntity); review it and add business rules here.
 */
@Injectable()
export class FindStructureVersionsUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(StructureVersionEntity);
  }

  private toReadModel(entity: StructureVersionEntity): StructureVersionPublicDto {
    return {
    createdAt: entity.createdAt,
    createdBy: entity.createdBy,
    folderId: entity.folderId,
    id: entity.id,
    manifestHash: entity.manifestHash,
    methodId: entity.methodId,
    notesSummary: entity.notesSummary,
    number: entity.number,
    schemaVersion: entity.schemaVersion,
    status: entity.status,
    structureId: entity.structureId,
    supersedesId: entity.supersedesId,
    updatedAt: entity.updatedAt,
    validationReport: entity.validationReport,
    version: entity.version,
    } as unknown as StructureVersionPublicDto;
  }

  async execute(input: StructureVersionListQueryDto): Promise<StructureVersionsListResponseDto> {
    const { rows, meta } = await listPage(this.repository, input);
    return { structureVersions: rows.map((entity) => this.toReadModel(entity)), meta } as unknown as StructureVersionsListResponseDto;
  }
}
