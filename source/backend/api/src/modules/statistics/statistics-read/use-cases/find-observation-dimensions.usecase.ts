import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import type { ObservationDimensionListQueryDto } from '#/modules/statistics/dto/observation-dimension-list-query.dto';
import type { ObservationDimensionPublicDto } from '#/modules/statistics/dto/observation-dimension-public.dto';
import type { ObservationDimensionDto } from '#/modules/statistics/dto/observation-dimension.dto';
import type { ObservationDimensionsListResponseDto } from '#/modules/statistics/dto/observation-dimensions-list-response.dto';
import type { ObservationDto } from '#/modules/statistics/dto/observation.dto';
import type { StatisticsTableDto } from '#/modules/statistics/dto/statistics-table.dto';
import { ObservationDimensionEntity } from '#/modules/statistics/entities/observation-dimension.entity';
import { listPage } from '#/read/list-page';

/**
 * List observation dimensions.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of ObservationDimensionEntity); review it and add business rules here.
 */
@Injectable()
export class FindObservationDimensionsUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(ObservationDimensionEntity);
  }

  private toReadModel(entity: ObservationDimensionEntity): ObservationDimensionPublicDto {
    return {
    createdAt: entity.createdAt,
    dimensionId: entity.dimensionId,
    id: entity.id,
    isCurrent: entity.isCurrent,
    memberId: entity.memberId,
    observationId: entity.observationId,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    version: entity.version,
    } as unknown as ObservationDimensionPublicDto;
  }

  async execute(input: ObservationDimensionListQueryDto): Promise<ObservationDimensionsListResponseDto> {
    const { rows, meta } = await listPage(this.repository, input);
    return { observationDimensions: rows.map((entity) => this.toReadModel(entity)), meta } as unknown as ObservationDimensionsListResponseDto;
  }
}
