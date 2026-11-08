import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import type { ObservationDerivationListQueryDto } from '#/modules/statistics/dto/observation-derivation-list-query.dto';
import type { ObservationDerivationPublicDto } from '#/modules/statistics/dto/observation-derivation-public.dto';
import type { ObservationDerivationDto } from '#/modules/statistics/dto/observation-derivation.dto';
import type { ObservationDerivationsListResponseDto } from '#/modules/statistics/dto/observation-derivations-list-response.dto';
import type { ObservationDto } from '#/modules/statistics/dto/observation.dto';
import type { StatisticsTableDto } from '#/modules/statistics/dto/statistics-table.dto';
import { ObservationDerivationEntity } from '#/modules/statistics/entities/observation-derivation.entity';
import { listPage } from '#/read/list-page';

/**
 * List observation derivations.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of ObservationDerivationEntity); review it and add business rules here.
 */
@Injectable()
export class FindObservationDerivationsUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(ObservationDerivationEntity);
  }

  private toReadModel(entity: ObservationDerivationEntity): ObservationDerivationPublicDto {
    return {
    computation: entity.computation,
    createdAt: entity.createdAt,
    id: entity.id,
    inputObservationId: entity.inputObservationId,
    inputRole: entity.inputRole,
    isCurrent: entity.isCurrent,
    observationId: entity.observationId,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    version: entity.version,
    } as unknown as ObservationDerivationPublicDto;
  }

  async execute(input: ObservationDerivationListQueryDto): Promise<ObservationDerivationsListResponseDto> {
    const { rows, meta } = await listPage(this.repository, input);
    return { derivations: rows.map((entity) => this.toReadModel(entity)), meta } as unknown as ObservationDerivationsListResponseDto;
  }
}
