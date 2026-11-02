import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import type { PeriodListQueryDto } from '#/modules/statistics/dto/period-list-query.dto';
import type { PeriodPublicDto } from '#/modules/statistics/dto/period-public.dto';
import type { PeriodDto } from '#/modules/statistics/dto/period.dto';
import type { PeriodsListResponseDto } from '#/modules/statistics/dto/periods-list-response.dto';
import { PeriodEntity } from '#/modules/statistics/entities/period.entity';
import { listPage } from '#/read/list-page';

/**
 * List periods.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of PeriodEntity); review it and add business rules here.
 */
@Injectable()
export class FindPeriodsUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(PeriodEntity);
  }

  private toReadModel(entity: PeriodEntity): PeriodPublicDto {
    return {
    code: entity.code,
    createdAt: entity.createdAt,
    endsOn: entity.endsOn,
    granularity: entity.granularity,
    id: entity.id,
    isCurrent: entity.isCurrent,
    startsOn: entity.startsOn,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    version: entity.version,
    } as unknown as PeriodPublicDto;
  }

  async execute(input: PeriodListQueryDto): Promise<PeriodsListResponseDto> {
    const { rows, meta } = await listPage(this.repository, input);
    return { periods: rows.map((entity) => this.toReadModel(entity)), meta } as unknown as PeriodsListResponseDto;
  }
}
