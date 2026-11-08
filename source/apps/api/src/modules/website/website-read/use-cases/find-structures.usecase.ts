import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import type { StructureListQueryDto } from '#/modules/website/dto/structure-list-query.dto';
import type { StructurePublicDto } from '#/modules/website/dto/structure-public.dto';
import type { StructureDto } from '#/modules/website/dto/structure.dto';
import type { StructuresListResponseDto } from '#/modules/website/dto/structures-list-response.dto';
import { StructureEntity } from '#/modules/website/entities/structure.entity';
import { listPage } from '#/read/list-page';

/**
 * List site structures.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of StructureEntity); review it and add business rules here.
 */
@Injectable()
export class FindStructuresUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(StructureEntity);
  }

  private toReadModel(entity: StructureEntity): StructurePublicDto {
    return {
    createdAt: entity.createdAt,
    currentVersionId: entity.currentVersionId,
    id: entity.id,
    ownerId: entity.ownerId,
    ownerKind: entity.ownerKind,
    purpose: entity.purpose,
    status: entity.status,
    updatedAt: entity.updatedAt,
    version: entity.version,
    } as unknown as StructurePublicDto;
  }

  async execute(input: StructureListQueryDto): Promise<StructuresListResponseDto> {
    const { rows, meta } = await listPage(this.repository, input);
    return { structures: rows.map((entity) => this.toReadModel(entity)), meta } as unknown as StructuresListResponseDto;
  }
}
