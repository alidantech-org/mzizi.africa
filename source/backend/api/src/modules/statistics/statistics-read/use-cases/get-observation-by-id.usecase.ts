import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { JurisdictionDto } from '#/modules/reference/dto/jurisdiction.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { EvidencedEntityDto } from '#/modules/shared/dto/evidenced-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { ObservationPublicDto } from '#/modules/statistics/dto/observation-public.dto';
import type { ObservationResponseDto } from '#/modules/statistics/dto/observation-response.dto';
import type { ObservationDto } from '#/modules/statistics/dto/observation.dto';
import type { StatisticsTableDto } from '#/modules/statistics/dto/statistics-table.dto';
import { ObservationEntity } from '#/modules/statistics/entities/observation.entity';

/**
 * Get observations by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of ObservationEntity); review it and add business rules here.
 */
@Injectable()
export class GetObservationByIdUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(ObservationEntity);
  }

  private toReadModel(entity: ObservationEntity): ObservationPublicDto {
    return {
    artifactChecksum: entity.artifactChecksum,
    artifactId: entity.artifactId,
    columnId: entity.columnId,
    confidence: entity.confidence,
    confidenceLevel: entity.confidenceLevel,
    createdAt: entity.createdAt,
    geoUnitId: entity.geoUnitId,
    id: entity.id,
    indicatorId: entity.indicatorId,
    isCurrent: entity.isCurrent,
    licence: entity.licence,
    method: entity.method,
    numericValue: entity.numericValue,
    periodId: entity.periodId,
    retrievedAt: entity.retrievedAt,
    sourceName: entity.sourceName,
    sourceReference: entity.sourceReference,
    sourceUrl: entity.sourceUrl,
    tableId: entity.tableId,
    textValue: entity.textValue,
    toolOrModel: entity.toolOrModel,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    verificationState: entity.verificationState,
    version: entity.version,
    } as unknown as ObservationPublicDto;
  }

  async execute(input: { observationId: string }): Promise<ObservationResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.observationId } as never);
    if (!entity) throw new NotFoundException('Observation not found');
    return {
      observation: this.toReadModel(entity),
    } as unknown as ObservationResponseDto;
  }
}