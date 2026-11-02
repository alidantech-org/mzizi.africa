import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import type { IndicatorCategoryDto } from '#/modules/statistics/dto/indicator-category.dto';
import type { IndicatorListQueryDto } from '#/modules/statistics/dto/indicator-list-query.dto';
import type { IndicatorPublicDto } from '#/modules/statistics/dto/indicator-public.dto';
import type { IndicatorDto } from '#/modules/statistics/dto/indicator.dto';
import type { IndicatorsListResponseDto } from '#/modules/statistics/dto/indicators-list-response.dto';
import { IndicatorEntity } from '#/modules/statistics/entities/indicator.entity';
import { listPage } from '#/read/list-page';

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
    categoryId: entity.categoryId,
    code: entity.code,
    createdAt: entity.createdAt,
    definition: entity.definition,
    id: entity.id,
    isCurrent: entity.isCurrent,
    name: entity.name,
    parentId: entity.parentId,
    unitOfMeasure: entity.unitOfMeasure,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    version: entity.version,
    } as unknown as IndicatorPublicDto;
  }

  async execute(input: IndicatorListQueryDto): Promise<IndicatorsListResponseDto> {
    const { rows, meta } = await listPage(this.repository, input);
    return { indicators: rows.map((entity) => this.toReadModel(entity)), meta } as unknown as IndicatorsListResponseDto;
  }
}
