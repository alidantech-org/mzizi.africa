import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import type { SiteFingerprintListQueryDto } from '#/modules/website/dto/site-fingerprint-list-query.dto';
import type { SiteFingerprintPublicDto } from '#/modules/website/dto/site-fingerprint-public.dto';
import type { SiteFingerprintDto } from '#/modules/website/dto/site-fingerprint.dto';
import type { SiteFingerprintsListResponseDto } from '#/modules/website/dto/site-fingerprints-list-response.dto';
import type { SiteDto } from '#/modules/website/dto/site.dto';
import { SiteFingerprintEntity } from '#/modules/website/entities/site-fingerprint.entity';
import { listPage } from '#/read/list-page';

/**
 * List site fingerprints.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of SiteFingerprintEntity); review it and add business rules here.
 */
@Injectable()
export class FindSiteFingerprintsUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(SiteFingerprintEntity);
  }

  private toReadModel(entity: SiteFingerprintEntity): SiteFingerprintPublicDto {
    return {
    checkId: entity.checkId,
    computedAt: entity.computedAt,
    createdAt: entity.createdAt,
    digest: entity.digest,
    features: entity.features,
    id: entity.id,
    kind: entity.kind,
    siteId: entity.siteId,
    updatedAt: entity.updatedAt,
    version: entity.version,
    } as unknown as SiteFingerprintPublicDto;
  }

  async execute(input: SiteFingerprintListQueryDto): Promise<SiteFingerprintsListResponseDto> {
    const { rows, meta } = await listPage(this.repository, input);
    return { siteFingerprints: rows.map((entity) => this.toReadModel(entity)), meta } as unknown as SiteFingerprintsListResponseDto;
  }
}
