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
import type { IndicatorCategoryDto } from '#/modules/statistics/dto/indicator-category.dto';
import type { IndicatorListQueryDto } from '#/modules/statistics/dto/indicator-list-query.dto';
import type { IndicatorPublicDto } from '#/modules/statistics/dto/indicator-public.dto';
import type { IndicatorDto } from '#/modules/statistics/dto/indicator.dto';
import type { IndicatorsListResponseDto } from '#/modules/statistics/dto/indicators-list-response.dto';
import { IndicatorEntity } from '#/modules/statistics/entities/indicator.entity';

/**
 * List indicators.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of IndicatorEntity); review it and add business rules here.
 */
@Injectable()
export class FindIndicatorsUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(IndicatorEntity);
  }

  private toReadModel(entity: IndicatorEntity): IndicatorPublicDto {
    return {
    artifactChecksum: entity.artifactChecksum,
    artifactId: entity.artifactId,
    categoryId: entity.categoryId,
    code: entity.code,
    confidence: entity.confidence,
    createdAt: entity.createdAt,
    definition: entity.definition,
    id: entity.id,
    isCurrent: entity.isCurrent,
    licence: entity.licence,
    method: entity.method,
    name: entity.name,
    parentId: entity.parentId,
    retrievedAt: entity.retrievedAt,
    sourceName: entity.sourceName,
    sourceReference: entity.sourceReference,
    sourceUrl: entity.sourceUrl,
    toolOrModel: entity.toolOrModel,
    unitOfMeasure: entity.unitOfMeasure,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    verificationState: entity.verificationState,
    version: entity.version,
    } as unknown as IndicatorPublicDto;
  }

  async execute(input: IndicatorListQueryDto): Promise<IndicatorsListResponseDto> {
    const page = Number(input.page ?? 1);
    const limit = Number(input.limit ?? 20);
    const where: Record<string, unknown> = {};
    if (input.categoryId !== undefined) where.categoryId = input.categoryId;
    if (input.parentId !== undefined) where.parentId = input.parentId;
    const [rows, total] = await this.repository.findAndCount({
      where: where as FindOptionsWhere<IndicatorEntity>,
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      indicators: rows.map((entity) => this.toReadModel(entity)),
    meta: {
      limit: limit,
      page: page,
      total: total,
      totalPages: Math.ceil(total / limit),
    },
    } as unknown as IndicatorsListResponseDto;
  }
}