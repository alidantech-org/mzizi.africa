import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import type { SiteCheckListQueryDto } from '#/modules/website/dto/site-check-list-query.dto';
import type { SiteCheckPublicDto } from '#/modules/website/dto/site-check-public.dto';
import type { SiteCheckDto } from '#/modules/website/dto/site-check.dto';
import type { SiteChecksListResponseDto } from '#/modules/website/dto/site-checks-list-response.dto';
import type { SiteDto } from '#/modules/website/dto/site.dto';
import { SiteCheckEntity } from '#/modules/website/entities/site-check.entity';
import { listPage } from '#/read/list-page';

/**
 * List site checks.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of SiteCheckEntity); review it and add business rules here.
 */
@Injectable()
export class FindSiteChecksUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(SiteCheckEntity);
  }

  private toReadModel(entity: SiteCheckEntity): SiteCheckPublicDto {
    return {
    checkedAt: entity.checkedAt,
    createdAt: entity.createdAt,
    detail: entity.detail,
    id: entity.id,
    kind: entity.kind,
    outcome: entity.outcome,
    siteId: entity.siteId,
    structureVersionId: entity.structureVersionId,
    updatedAt: entity.updatedAt,
    version: entity.version,
    } as unknown as SiteCheckPublicDto;
  }

  async execute(input: SiteCheckListQueryDto): Promise<SiteChecksListResponseDto> {
    const { rows, meta } = await listPage(this.repository, input);
    return { siteChecks: rows.map((entity) => this.toReadModel(entity)), meta } as unknown as SiteChecksListResponseDto;
  }
}
