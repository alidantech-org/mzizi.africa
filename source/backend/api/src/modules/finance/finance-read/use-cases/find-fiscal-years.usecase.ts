import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { FiscalYearListQueryDto } from '#/modules/finance/dto/fiscal-year-list-query.dto';
import type { FiscalYearPublicDto } from '#/modules/finance/dto/fiscal-year-public.dto';
import type { FiscalYearDto } from '#/modules/finance/dto/fiscal-year.dto';
import type { FiscalYearsListResponseDto } from '#/modules/finance/dto/fiscal-years-list-response.dto';
import type { JurisdictionDto } from '#/modules/reference/dto/jurisdiction.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { EvidencedEntityDto } from '#/modules/shared/dto/evidenced-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import { FiscalYearEntity } from '#/modules/finance/entities/fiscal-year.entity';

/**
 * List fiscal years.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of FiscalYearEntity); review it and add business rules here.
 */
@Injectable()
export class FindFiscalYearsUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(FiscalYearEntity);
  }

  private toReadModel(entity: FiscalYearEntity): FiscalYearPublicDto {
    return {
    artifactChecksum: entity.artifactChecksum,
    artifactId: entity.artifactId,
    code: entity.code,
    confidence: entity.confidence,
    createdAt: entity.createdAt,
    endsOn: entity.endsOn,
    id: entity.id,
    isCurrent: entity.isCurrent,
    jurisdictionId: entity.jurisdictionId,
    licence: entity.licence,
    method: entity.method,
    retrievedAt: entity.retrievedAt,
    sourceName: entity.sourceName,
    sourceReference: entity.sourceReference,
    sourceUrl: entity.sourceUrl,
    startsOn: entity.startsOn,
    toolOrModel: entity.toolOrModel,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    verificationState: entity.verificationState,
    version: entity.version,
    } as unknown as FiscalYearPublicDto;
  }

  async execute(input: FiscalYearListQueryDto): Promise<FiscalYearsListResponseDto> {
    const page = Number(input.page ?? 1);
    const limit = Number(input.limit ?? 20);
    const where: Record<string, unknown> = {};
    if (input.jurisdictionId !== undefined) where.jurisdictionId = input.jurisdictionId;
    const [rows, total] = await this.repository.findAndCount({
      where: where as FindOptionsWhere<FiscalYearEntity>,
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      fiscalYears: rows.map((entity) => this.toReadModel(entity)),
    meta: {
      limit: limit,
      page: page,
      total: total,
      totalPages: Math.ceil(total / limit),
    },
    } as unknown as FiscalYearsListResponseDto;
  }
}