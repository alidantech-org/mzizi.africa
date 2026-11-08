import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import type { DimensionListQueryDto } from '#/modules/statistics/dto/dimension-list-query.dto';
import type { DimensionPublicDto } from '#/modules/statistics/dto/dimension-public.dto';
import type { DimensionDto } from '#/modules/statistics/dto/dimension.dto';
import type { DimensionsListResponseDto } from '#/modules/statistics/dto/dimensions-list-response.dto';
import { DimensionEntity } from '#/modules/statistics/entities/dimension.entity';
import { listPage } from '#/read/list-page';

/**
 * List dimensions.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of DimensionEntity); review it and add business rules here.
 */
@Injectable()
export class FindDimensionsUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(DimensionEntity);
  }

  private toReadModel(entity: DimensionEntity): DimensionPublicDto {
    return {
    code: entity.code,
    createdAt: entity.createdAt,
    description: entity.description,
    id: entity.id,
    isCurrent: entity.isCurrent,
    name: entity.name,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    version: entity.version,
    } as unknown as DimensionPublicDto;
  }

  async execute(input: DimensionListQueryDto): Promise<DimensionsListResponseDto> {
    const { rows, meta } = await listPage(this.repository, input);
    return { dimensions: rows.map((entity) => this.toReadModel(entity)), meta } as unknown as DimensionsListResponseDto;
  }
}
