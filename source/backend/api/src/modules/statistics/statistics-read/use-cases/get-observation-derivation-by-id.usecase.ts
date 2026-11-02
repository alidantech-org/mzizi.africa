import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { ObservationDerivationPublicDto } from '#/modules/statistics/dto/observation-derivation-public.dto';
import type { ObservationDerivationResponseDto } from '#/modules/statistics/dto/observation-derivation-response.dto';
import type { ObservationDerivationDto } from '#/modules/statistics/dto/observation-derivation.dto';
import type { ObservationDto } from '#/modules/statistics/dto/observation.dto';
import type { StatisticsTableDto } from '#/modules/statistics/dto/statistics-table.dto';
import { ObservationDerivationEntity } from '#/modules/statistics/entities/observation-derivation.entity';

/**
 * Get observation derivations by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of ObservationDerivationEntity); review it and add business rules here.
 */
@Injectable()
export class GetObservationDerivationByIdUseCase {
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

  async execute(input: { derivationId: string }): Promise<ObservationDerivationResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.derivationId } as never);
    if (!entity) throw new NotFoundException('ObservationDerivation not found');
    return {
      derivation: this.toReadModel(entity),
    } as unknown as ObservationDerivationResponseDto;
  }
}