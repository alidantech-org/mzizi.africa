import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { BudgetaryUnitDto } from '#/modules/finance/dto/budgetary-unit.dto';
import type { LedgerEntriesListResponseDto } from '#/modules/finance/dto/ledger-entries-list-response.dto';
import type { LedgerEntryListQueryDto } from '#/modules/finance/dto/ledger-entry-list-query.dto';
import type { LedgerEntryPublicDto } from '#/modules/finance/dto/ledger-entry-public.dto';
import type { LedgerEntryDto } from '#/modules/finance/dto/ledger-entry.dto';
import type { JurisdictionDto } from '#/modules/reference/dto/jurisdiction.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { EvidencedEntityDto } from '#/modules/shared/dto/evidenced-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import { LedgerEntryEntity } from '#/modules/finance/entities/ledger-entry.entity';

/**
 * List ledger entries.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of LedgerEntryEntity); review it and add business rules here.
 */
@Injectable()
export class FindLedgerEntriesUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(LedgerEntryEntity);
  }

  private toReadModel(entity: LedgerEntryEntity): LedgerEntryPublicDto {
    return {
    accountCode: entity.accountCode,
    artifactChecksum: entity.artifactChecksum,
    artifactId: entity.artifactId,
    confidence: entity.confidence,
    createdAt: entity.createdAt,
    creditAmount: entity.creditAmount,
    currencyCode: entity.currencyCode,
    debitAmount: entity.debitAmount,
    id: entity.id,
    isCurrent: entity.isCurrent,
    licence: entity.licence,
    method: entity.method,
    postedOn: entity.postedOn,
    referenceId: entity.referenceId,
    referenceKind: entity.referenceKind,
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
    } as unknown as LedgerEntryPublicDto;
  }

  async execute(input: LedgerEntryListQueryDto): Promise<LedgerEntriesListResponseDto> {
    const page = Number(input.page ?? 1);
    const limit = Number(input.limit ?? 20);
    const where: Record<string, unknown> = {};
    if (input.referenceId !== undefined) where.referenceId = input.referenceId;
    if (input.unitId !== undefined) where.unitId = input.unitId;
    const [rows, total] = await this.repository.findAndCount({
      where: where as FindOptionsWhere<LedgerEntryEntity>,
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      entries: rows.map((entity) => this.toReadModel(entity)),
    meta: {
      limit: limit,
      page: page,
      total: total,
      totalPages: Math.ceil(total / limit),
    },
    } as unknown as LedgerEntriesListResponseDto;
  }
}