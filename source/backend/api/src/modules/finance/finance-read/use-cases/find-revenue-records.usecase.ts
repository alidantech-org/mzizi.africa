import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { BudgetaryUnitDto } from '#/modules/finance/dto/budgetary-unit.dto';
import type { RevenueRecordListQueryDto } from '#/modules/finance/dto/revenue-record-list-query.dto';
import type { RevenueRecordPublicDto } from '#/modules/finance/dto/revenue-record-public.dto';
import type { RevenueRecordDto } from '#/modules/finance/dto/revenue-record.dto';
import type { RevenueRecordsListResponseDto } from '#/modules/finance/dto/revenue-records-list-response.dto';
import type { JurisdictionDto } from '#/modules/reference/dto/jurisdiction.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { EvidencedEntityDto } from '#/modules/shared/dto/evidenced-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import { RevenueRecordEntity } from '#/modules/finance/entities/revenue-record.entity';
import { listPage } from '#/read/list-page';

/**
 * List revenue records.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of RevenueRecordEntity); review it and add business rules here.
 */
@Injectable()
export class FindRevenueRecordsUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(RevenueRecordEntity);
  }

  private toReadModel(entity: RevenueRecordEntity): RevenueRecordPublicDto {
    return {
    amount: entity.amount,
    artifactChecksum: entity.artifactChecksum,
    artifactId: entity.artifactId,
    categoryId: entity.categoryId,
    confidence: entity.confidence,
    createdAt: entity.createdAt,
    currencyCode: entity.currencyCode,
    fiscalYearId: entity.fiscalYearId,
    id: entity.id,
    isCurrent: entity.isCurrent,
    licence: entity.licence,
    method: entity.method,
    payerEntityId: entity.payerEntityId,
    receivedOn: entity.receivedOn,
    restriction: entity.restriction,
    retrievedAt: entity.retrievedAt,
    sourceName: entity.sourceName,
    sourceReference: entity.sourceReference,
    sourceUrl: entity.sourceUrl,
    toolOrModel: entity.toolOrModel,
    unitId: entity.unitId,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    verificationState: entity.verificationState,
    version: entity.version,
    } as unknown as RevenueRecordPublicDto;
  }

  async execute(input: RevenueRecordListQueryDto): Promise<RevenueRecordsListResponseDto> {
    const { rows, meta } = await listPage(this.repository, input);
    return { revenues: rows.map((entity) => this.toReadModel(entity)), meta } as unknown as RevenueRecordsListResponseDto;
  }
}
