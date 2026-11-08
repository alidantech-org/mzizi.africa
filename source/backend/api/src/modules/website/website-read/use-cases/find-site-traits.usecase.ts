import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import type { SiteTraitListQueryDto } from '#/modules/website/dto/site-trait-list-query.dto';
import type { SiteTraitPublicDto } from '#/modules/website/dto/site-trait-public.dto';
import type { SiteTraitDto } from '#/modules/website/dto/site-trait.dto';
import type { SiteTraitsListResponseDto } from '#/modules/website/dto/site-traits-list-response.dto';
import { SiteTraitEntity } from '#/modules/website/entities/site-trait.entity';
import { listPage } from '#/read/list-page';

/**
 * List site and family traits.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of SiteTraitEntity); review it and add business rules here.
 */
@Injectable()
export class FindSiteTraitsUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(SiteTraitEntity);
  }

  private toReadModel(entity: SiteTraitEntity): SiteTraitPublicDto {
    return {
    createdAt: entity.createdAt,
    id: entity.id,
    methodId: entity.methodId,
    observedAt: entity.observedAt,
    ownerId: entity.ownerId,
    ownerKind: entity.ownerKind,
    score: entity.score,
    tag: entity.tag,
    updatedAt: entity.updatedAt,
    version: entity.version,
    } as unknown as SiteTraitPublicDto;
  }

  async execute(input: SiteTraitListQueryDto): Promise<SiteTraitsListResponseDto> {
    const { rows, meta } = await listPage(this.repository, input);
    return { siteTraits: rows.map((entity) => this.toReadModel(entity)), meta } as unknown as SiteTraitsListResponseDto;
  }
}
