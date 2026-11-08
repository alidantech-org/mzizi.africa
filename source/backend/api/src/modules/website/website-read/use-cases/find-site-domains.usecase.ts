import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import type { SiteDomainListQueryDto } from '#/modules/website/dto/site-domain-list-query.dto';
import type { SiteDomainPublicDto } from '#/modules/website/dto/site-domain-public.dto';
import type { SiteDomainDto } from '#/modules/website/dto/site-domain.dto';
import type { SiteDomainsListResponseDto } from '#/modules/website/dto/site-domains-list-response.dto';
import type { SiteDto } from '#/modules/website/dto/site.dto';
import { SiteDomainEntity } from '#/modules/website/entities/site-domain.entity';
import { listPage } from '#/read/list-page';

/**
 * List site domains.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of SiteDomainEntity); review it and add business rules here.
 */
@Injectable()
export class FindSiteDomainsUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(SiteDomainEntity);
  }

  private toReadModel(entity: SiteDomainEntity): SiteDomainPublicDto {
    return {
    createdAt: entity.createdAt,
    hostname: entity.hostname,
    id: entity.id,
    observedAt: entity.observedAt,
    role: entity.role,
    scheme: entity.scheme,
    siteId: entity.siteId,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    version: entity.version,
    } as unknown as SiteDomainPublicDto;
  }

  async execute(input: SiteDomainListQueryDto): Promise<SiteDomainsListResponseDto> {
    const { rows, meta } = await listPage(this.repository, input);
    return { domains: rows.map((entity) => this.toReadModel(entity)), meta } as unknown as SiteDomainsListResponseDto;
  }
}
