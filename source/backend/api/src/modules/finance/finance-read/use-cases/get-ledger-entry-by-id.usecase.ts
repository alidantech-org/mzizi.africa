import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { BudgetaryUnitDto } from '#/modules/finance/dto/budgetary-unit.dto';
import type { LedgerEntryPublicDto } from '#/modules/finance/dto/ledger-entry-public.dto';
import type { LedgerEntryResponseDto } from '#/modules/finance/dto/ledger-entry-response.dto';
import type { LedgerEntryDto } from '#/modules/finance/dto/ledger-entry.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import { LedgerEntryEntity } from '#/modules/finance/entities/ledger-entry.entity';

/**
 * Get ledger entries by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of LedgerEntryEntity); review it and add business rules here.
 */
@Injectable()
export class GetLedgerEntryByIdUseCase {
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

  async execute(input: { entryId: string }): Promise<LedgerEntryResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.entryId } as never);
    if (!entity) throw new NotFoundException('LedgerEntry not found');
    return {
      entry: this.toReadModel(entity),
    } as unknown as LedgerEntryResponseDto;
  }
}