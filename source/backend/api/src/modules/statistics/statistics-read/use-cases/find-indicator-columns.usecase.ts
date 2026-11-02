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
import type { IndicatorColumnListQueryDto } from '#/modules/statistics/dto/indicator-column-list-query.dto';
import type { IndicatorColumnPublicDto } from '#/modules/statistics/dto/indicator-column-public.dto';
import type { IndicatorColumnDto } from '#/modules/statistics/dto/indicator-column.dto';
import type { IndicatorColumnsListResponseDto } from '#/modules/statistics/dto/indicator-columns-list-response.dto';
import type { IndicatorDto } from '#/modules/statistics/dto/indicator.dto';
import { IndicatorColumnEntity } from '#/modules/statistics/entities/indicator-column.entity';

/**
 * List indicator columns.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of IndicatorColumnEntity); review it and add business rules here.
 */
@Injectable()
export class FindIndicatorColumnsUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(IndicatorColumnEntity);
  }

  private toReadModel(entity: IndicatorColumnEntity): IndicatorColumnPublicDto {
    return {
    artifactChecksum: entity.artifactChecksum,
    artifactId: entity.artifactId,
    code: entity.code,
    confidence: entity.confidence,
    createdAt: entity.createdAt,
    dataType: entity.dataType,
    id: entity.id,
    indicatorId: entity.indicatorId,
    isCurrent: entity.isCurrent,
    label: entity.label,
    licence: entity.licence,
    method: entity.method,
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
    } as unknown as IndicatorColumnPublicDto;
  }

  async execute(input: IndicatorColumnListQueryDto): Promise<IndicatorColumnsListResponseDto> {
    const page = Number(input.page ?? 1);
    const limit = Number(input.limit ?? 20);
    const where: Record<string, unknown> = {};
    if (input.indicatorId !== undefined) where.indicatorId = input.indicatorId;
    const [rows, total] = await this.repository.findAndCount({
      where: where as FindOptionsWhere<IndicatorColumnEntity>,
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      columns: rows.map((entity) => this.toReadModel(entity)),
    meta: {
      limit: limit,
      page: page,
      total: total,
      totalPages: Math.ceil(total / limit),
    },
    } as unknown as IndicatorColumnsListResponseDto;
  }
}