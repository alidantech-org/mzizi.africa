import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import type { SiteRelationListQueryDto } from '#/modules/website/dto/site-relation-list-query.dto';
import type { SiteRelationPublicDto } from '#/modules/website/dto/site-relation-public.dto';
import type { SiteRelationDto } from '#/modules/website/dto/site-relation.dto';
import type { SiteRelationsListResponseDto } from '#/modules/website/dto/site-relations-list-response.dto';
import { SiteRelationEntity } from '#/modules/website/entities/site-relation.entity';
import { listPage } from '#/read/list-page';

/**
 * List site and family relations.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of SiteRelationEntity); review it and add business rules here.
 */
@Injectable()
export class FindSiteRelationsUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(SiteRelationEntity);
  }

  private toReadModel(entity: SiteRelationEntity): SiteRelationPublicDto {
    return {
    basis: entity.basis,
    createdAt: entity.createdAt,
    evidence: entity.evidence,
    fromId: entity.fromId,
    fromKind: entity.fromKind,
    id: entity.id,
    relation: entity.relation,
    score: entity.score,
    toId: entity.toId,
    toKind: entity.toKind,
    updatedAt: entity.updatedAt,
    version: entity.version,
    } as unknown as SiteRelationPublicDto;
  }

  async execute(input: SiteRelationListQueryDto): Promise<SiteRelationsListResponseDto> {
    const { rows, meta } = await listPage(this.repository, input);
    return { siteRelations: rows.map((entity) => this.toReadModel(entity)), meta } as unknown as SiteRelationsListResponseDto;
  }
}
