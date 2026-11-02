import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { ObservationDimensionPublicDto } from '#/modules/statistics/dto/observation-dimension-public.dto';
import type { ObservationDimensionResponseDto } from '#/modules/statistics/dto/observation-dimension-response.dto';
import type { ObservationDimensionDto } from '#/modules/statistics/dto/observation-dimension.dto';
import type { ObservationDto } from '#/modules/statistics/dto/observation.dto';
import type { StatisticsTableDto } from '#/modules/statistics/dto/statistics-table.dto';
import { ObservationDimensionEntity } from '#/modules/statistics/entities/observation-dimension.entity';

/**
 * Get observation dimensions by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of ObservationDimensionEntity); review it and add business rules here.
 */
@Injectable()
export class GetObservationDimensionByIdUseCase {
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

  async execute(input: { observationDimensionId: string }): Promise<ObservationDimensionResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.observationDimensionId } as never);
    if (!entity) throw new NotFoundException('ObservationDimension not found');
    return {
      observationDimension: this.toReadModel(entity),
    } as unknown as ObservationDimensionResponseDto;
  }
}