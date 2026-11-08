import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import type { SitePublisherListQueryDto } from '#/modules/website/dto/site-publisher-list-query.dto';
import type { SitePublisherPublicDto } from '#/modules/website/dto/site-publisher-public.dto';
import type { SitePublisherDto } from '#/modules/website/dto/site-publisher.dto';
import type { SitePublishersListResponseDto } from '#/modules/website/dto/site-publishers-list-response.dto';
import type { SiteDto } from '#/modules/website/dto/site.dto';
import { SitePublisherEntity } from '#/modules/website/entities/site-publisher.entity';
import { listPage } from '#/read/list-page';

/**
 * List site and publisher links.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of SitePublisherEntity); review it and add business rules here.
 */
@Injectable()
export class FindSitePublishersUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(SitePublisherEntity);
  }

  private toReadModel(entity: SitePublisherEntity): SitePublisherPublicDto {
    return {
    createdAt: entity.createdAt,
    id: entity.id,
    publisherId: entity.publisherId,
    role: entity.role,
    siteId: entity.siteId,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validTo: entity.validTo,
    version: entity.version,
    } as unknown as SitePublisherPublicDto;
  }

  async execute(input: SitePublisherListQueryDto): Promise<SitePublishersListResponseDto> {
    const { rows, meta } = await listPage(this.repository, input);
    return { sitePublishers: rows.map((entity) => this.toReadModel(entity)), meta } as unknown as SitePublishersListResponseDto;
  }
}
