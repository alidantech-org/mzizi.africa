import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { EvidencedEntityDto } from '#/modules/shared/dto/evidenced-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import type { IndicatorCategoriesListResponseDto } from '#/modules/statistics/dto/indicator-categories-list-response.dto';
import type { IndicatorCategoryListQueryDto } from '#/modules/statistics/dto/indicator-category-list-query.dto';
import type { IndicatorCategoryPublicDto } from '#/modules/statistics/dto/indicator-category-public.dto';
import type { IndicatorCategoryDto } from '#/modules/statistics/dto/indicator-category.dto';
import { IndicatorCategoryEntity } from '#/modules/statistics/entities/indicator-category.entity';
import { listPage } from '#/read/list-page';

/**
 * List indicator categories.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of IndicatorCategoryEntity); review it and add business rules here.
 */
@Injectable()
export class FindIndicatorCategoriesUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(IndicatorCategoryEntity);
  }

  private toReadModel(entity: IndicatorCategoryEntity): IndicatorCategoryPublicDto {
    return {
    artifactChecksum: entity.artifactChecksum,
    artifactId: entity.artifactId,
    code: entity.code,
    confidence: entity.confidence,
    createdAt: entity.createdAt,
    id: entity.id,
    isCurrent: entity.isCurrent,
    label: entity.label,
    licence: entity.licence,
    method: entity.method,
    parentId: entity.parentId,
    retrievedAt: entity.retrievedAt,
    sourceName: entity.sourceName,
    sourceReference: entity.sourceReference,
    sourceUrl: entity.sourceUrl,
    toolOrModel: entity.toolOrModel,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    verificationState: entity.verificationState,
    version: entity.version,
    } as unknown as IndicatorCategoryPublicDto;
  }

  async execute(input: IndicatorCategoryListQueryDto): Promise<IndicatorCategoriesListResponseDto> {
    const { rows, meta } = await listPage(this.repository, input);
    return { categories: rows.map((entity) => this.toReadModel(entity)), meta } as unknown as IndicatorCategoriesListResponseDto;
  }
}
