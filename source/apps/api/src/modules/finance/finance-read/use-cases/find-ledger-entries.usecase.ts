import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { BudgetaryUnitDto } from '#/modules/finance/dto/budgetary-unit.dto';
import type { LedgerEntriesListResponseDto } from '#/modules/finance/dto/ledger-entries-list-response.dto';
import type { LedgerEntryListQueryDto } from '#/modules/finance/dto/ledger-entry-list-query.dto';
import type { LedgerEntryPublicDto } from '#/modules/finance/dto/ledger-entry-public.dto';
import type { LedgerEntryDto } from '#/modules/finance/dto/ledger-entry.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import { LedgerEntryEntity } from '#/modules/finance/entities/ledger-entry.entity';
import { listPage } from '#/read/list-page';

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
    createdAt: entity.createdAt,
    creditAmount: entity.creditAmount,
    currencyCode: entity.currencyCode,
    debitAmount: entity.debitAmount,
    id: entity.id,
    isCurrent: entity.isCurrent,
    postedOn: entity.postedOn,
    referenceId: entity.referenceId,
    referenceKind: entity.referenceKind,
    unitId: entity.unitId,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    version: entity.version,
    } as unknown as LedgerEntryPublicDto;
  }

  async execute(input: LedgerEntryListQueryDto): Promise<LedgerEntriesListResponseDto> {
    const { rows, meta } = await listPage(this.repository, input);
    return { entries: rows.map((entity) => this.toReadModel(entity)), meta } as unknown as LedgerEntriesListResponseDto;
  }
}
