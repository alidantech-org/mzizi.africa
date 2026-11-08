import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import type { SiteListQueryDto } from '#/modules/website/dto/site-list-query.dto';
import type { SitePublicDto } from '#/modules/website/dto/site-public.dto';
import type { SiteDto } from '#/modules/website/dto/site.dto';
import type { SitesListResponseDto } from '#/modules/website/dto/sites-list-response.dto';
import { SiteEntity } from '#/modules/website/entities/site.entity';
import { listPage } from '#/read/list-page';

/**
 * List known sites.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of SiteEntity); review it and add business rules here.
 */
@Injectable()
export class FindSitesUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(SiteEntity);
  }

  private toReadModel(entity: SiteEntity): SitePublicDto {
    return {
    code: entity.code,
    createdAt: entity.createdAt,
    description: entity.description,
    firstSeenAt: entity.firstSeenAt,
    id: entity.id,
    jurisdictionId: entity.jurisdictionId,
    kind: entity.kind,
    lastSeenAt: entity.lastSeenAt,
    name: entity.name,
    status: entity.status,
    updatedAt: entity.updatedAt,
    version: entity.version,
    } as unknown as SitePublicDto;
  }

  async execute(input: SiteListQueryDto): Promise<SitesListResponseDto> {
    const { rows, meta } = await listPage(this.repository, input);
    return { sites: rows.map((entity) => this.toReadModel(entity)), meta } as unknown as SitesListResponseDto;
  }
}
