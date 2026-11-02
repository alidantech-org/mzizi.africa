import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { JurisdictionDto } from '#/modules/reference/dto/jurisdiction.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { EvidencedEntityDto } from '#/modules/shared/dto/evidenced-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import type { ObservationListQueryDto } from '#/modules/statistics/dto/observation-list-query.dto';
import type { ObservationPublicDto } from '#/modules/statistics/dto/observation-public.dto';
import type { ObservationDto } from '#/modules/statistics/dto/observation.dto';
import type { ObservationsListResponseDto } from '#/modules/statistics/dto/observations-list-response.dto';
import type { StatisticsTableDto } from '#/modules/statistics/dto/statistics-table.dto';
import { ObservationEntity } from '#/modules/statistics/entities/observation.entity';

/**
 * List observations.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of ObservationEntity); review it and add business rules here.
 */
@Injectable()
export class FindObservationsUseCase {
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

  async execute(input: ObservationListQueryDto): Promise<ObservationsListResponseDto> {
    const page = Number(input.page ?? 1);
    const limit = Number(input.limit ?? 20);
    const where: Record<string, unknown> = {};
    if (input.confidenceLevel !== undefined) where.confidenceLevel = input.confidenceLevel;
    if (input.geoUnitId !== undefined) where.geoUnitId = input.geoUnitId;
    if (input.indicatorId !== undefined) where.indicatorId = input.indicatorId;
    if (input.periodId !== undefined) where.periodId = input.periodId;
    if (input.tableId !== undefined) where.tableId = input.tableId;
    const [rows, total] = await this.repository.findAndCount({
      where: where as FindOptionsWhere<ObservationEntity>,
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      observations: rows.map((entity) => this.toReadModel(entity)),
    meta: {
      limit: limit,
      page: page,
      total: total,
      totalPages: Math.ceil(total / limit),
    },
    } as unknown as ObservationsListResponseDto;
  }
}