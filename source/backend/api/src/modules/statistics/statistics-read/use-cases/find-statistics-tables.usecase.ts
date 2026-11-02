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
import type { StatisticsTableListQueryDto } from '#/modules/statistics/dto/statistics-table-list-query.dto';
import type { StatisticsTablePublicDto } from '#/modules/statistics/dto/statistics-table-public.dto';
import type { StatisticsTableDto } from '#/modules/statistics/dto/statistics-table.dto';
import type { StatisticsTablesListResponseDto } from '#/modules/statistics/dto/statistics-tables-list-response.dto';
import { StatisticsTableEntity } from '#/modules/statistics/entities/statistics-table.entity';

/**
 * List statistics tables.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of StatisticsTableEntity); review it and add business rules here.
 */
@Injectable()
export class FindStatisticsTablesUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(StatisticsTableEntity);
  }

  private toReadModel(entity: StatisticsTableEntity): StatisticsTablePublicDto {
    return {
    artifactChecksum: entity.artifactChecksum,
    artifactId: entity.artifactId,
    code: entity.code,
    collector: entity.collector,
    confidence: entity.confidence,
    createdAt: entity.createdAt,
    geoUnitId: entity.geoUnitId,
    id: entity.id,
    indicatorId: entity.indicatorId,
    isCurrent: entity.isCurrent,
    jurisdictionId: entity.jurisdictionId,
    licence: entity.licence,
    method: entity.method,
    methodology: entity.methodology,
    publisherInstitutionId: entity.publisherInstitutionId,
    retrievedAt: entity.retrievedAt,
    sourceName: entity.sourceName,
    sourceReference: entity.sourceReference,
    sourceUrl: entity.sourceUrl,
    title: entity.title,
    toolOrModel: entity.toolOrModel,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    verificationState: entity.verificationState,
    version: entity.version,
    } as unknown as StatisticsTablePublicDto;
  }

  async execute(input: StatisticsTableListQueryDto): Promise<StatisticsTablesListResponseDto> {
    const page = Number(input.page ?? 1);
    const limit = Number(input.limit ?? 20);
    const where: Record<string, unknown> = {};
    if (input.geoUnitId !== undefined) where.geoUnitId = input.geoUnitId;
    if (input.indicatorId !== undefined) where.indicatorId = input.indicatorId;
    if (input.jurisdictionId !== undefined) where.jurisdictionId = input.jurisdictionId;
    const [rows, total] = await this.repository.findAndCount({
      where: where as FindOptionsWhere<StatisticsTableEntity>,
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      tables: rows.map((entity) => this.toReadModel(entity)),
    meta: {
      limit: limit,
      page: page,
      total: total,
      totalPages: Math.ceil(total / limit),
    },
    } as unknown as StatisticsTablesListResponseDto;
  }
}