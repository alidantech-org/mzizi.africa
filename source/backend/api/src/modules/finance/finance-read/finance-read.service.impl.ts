import { Injectable } from '@nestjs/common';
import type { BudgetListQueryDto } from '#/modules/finance/dto/budget-list-query.dto';
import type { BudgetResponseDto } from '#/modules/finance/dto/budget-response.dto';
import type { BudgetaryUnitListQueryDto } from '#/modules/finance/dto/budgetary-unit-list-query.dto';
import type { BudgetaryUnitResponseDto } from '#/modules/finance/dto/budgetary-unit-response.dto';
import type { BudgetaryUnitsListResponseDto } from '#/modules/finance/dto/budgetary-units-list-response.dto';
import type { BudgetsListResponseDto } from '#/modules/finance/dto/budgets-list-response.dto';
import type { ExpenditureListQueryDto } from '#/modules/finance/dto/expenditure-list-query.dto';
import type { ExpenditureResponseDto } from '#/modules/finance/dto/expenditure-response.dto';
import type { ExpendituresListResponseDto } from '#/modules/finance/dto/expenditures-list-response.dto';
import type { FiscalYearListQueryDto } from '#/modules/finance/dto/fiscal-year-list-query.dto';
import type { FiscalYearResponseDto } from '#/modules/finance/dto/fiscal-year-response.dto';
import type { FiscalYearsListResponseDto } from '#/modules/finance/dto/fiscal-years-list-response.dto';
import type { LedgerEntriesListResponseDto } from '#/modules/finance/dto/ledger-entries-list-response.dto';
import type { LedgerEntryListQueryDto } from '#/modules/finance/dto/ledger-entry-list-query.dto';
import type { LedgerEntryResponseDto } from '#/modules/finance/dto/ledger-entry-response.dto';
import type { RevenueRecordListQueryDto } from '#/modules/finance/dto/revenue-record-list-query.dto';
import type { RevenueRecordResponseDto } from '#/modules/finance/dto/revenue-record-response.dto';
import type { RevenueRecordsListResponseDto } from '#/modules/finance/dto/revenue-records-list-response.dto';
import type { TransferListQueryDto } from '#/modules/finance/dto/transfer-list-query.dto';
import type { TransferResponseDto } from '#/modules/finance/dto/transfer-response.dto';
import type { TransfersListResponseDto } from '#/modules/finance/dto/transfers-list-response.dto';
import { FindBudgetaryUnitsUseCase } from '#/modules/finance/finance-read/use-cases/find-budgetary-units.usecase';
import { FindBudgetsUseCase } from '#/modules/finance/finance-read/use-cases/find-budgets.usecase';
import { FindExpendituresUseCase } from '#/modules/finance/finance-read/use-cases/find-expenditures.usecase';
import { FindFiscalYearsUseCase } from '#/modules/finance/finance-read/use-cases/find-fiscal-years.usecase';
import { FindLedgerEntriesUseCase } from '#/modules/finance/finance-read/use-cases/find-ledger-entries.usecase';
import { FindRevenueRecordsUseCase } from '#/modules/finance/finance-read/use-cases/find-revenue-records.usecase';
import { FindTransfersUseCase } from '#/modules/finance/finance-read/use-cases/find-transfers.usecase';
import { GetBudgetByIdUseCase } from '#/modules/finance/finance-read/use-cases/get-budget-by-id.usecase';
import { GetBudgetaryUnitByIdUseCase } from '#/modules/finance/finance-read/use-cases/get-budgetary-unit-by-id.usecase';
import { GetExpenditureByIdUseCase } from '#/modules/finance/finance-read/use-cases/get-expenditure-by-id.usecase';
import { GetFiscalYearByIdUseCase } from '#/modules/finance/finance-read/use-cases/get-fiscal-year-by-id.usecase';
import { GetLedgerEntryByIdUseCase } from '#/modules/finance/finance-read/use-cases/get-ledger-entry-by-id.usecase';
import { GetRevenueRecordByIdUseCase } from '#/modules/finance/finance-read/use-cases/get-revenue-record-by-id.usecase';
import { GetTransferByIdUseCase } from '#/modules/finance/finance-read/use-cases/get-transfer-by-id.usecase';

/**
 * Finance Read: implements the generated FinanceFinanceReadService contract by
 * delegating to one use case per operation. The feature module binds it to that contract.
 *
 * Scaffolded by Dryv once; this file belongs to the project. New operations need a method here.
 */
@Injectable()
export class FinanceFinanceReadServiceImpl {
  constructor(
    private readonly findBudgetaryUnitsUseCase: FindBudgetaryUnitsUseCase,
    private readonly findBudgetsUseCase: FindBudgetsUseCase,
    private readonly findExpendituresUseCase: FindExpendituresUseCase,
    private readonly findFiscalYearsUseCase: FindFiscalYearsUseCase,
    private readonly findLedgerEntriesUseCase: FindLedgerEntriesUseCase,
    private readonly findRevenueRecordsUseCase: FindRevenueRecordsUseCase,
    private readonly findTransfersUseCase: FindTransfersUseCase,
    private readonly getBudgetByIdUseCase: GetBudgetByIdUseCase,
    private readonly getBudgetaryUnitByIdUseCase: GetBudgetaryUnitByIdUseCase,
    private readonly getExpenditureByIdUseCase: GetExpenditureByIdUseCase,
    private readonly getFiscalYearByIdUseCase: GetFiscalYearByIdUseCase,
    private readonly getLedgerEntryByIdUseCase: GetLedgerEntryByIdUseCase,
    private readonly getRevenueRecordByIdUseCase: GetRevenueRecordByIdUseCase,
    private readonly getTransferByIdUseCase: GetTransferByIdUseCase,
  ) {}

  /** List budgetary units. */
  findBudgetaryUnits(input: BudgetaryUnitListQueryDto) {
    return this.findBudgetaryUnitsUseCase.execute(input);
  }

  /** List budgets. */
  findBudgets(input: BudgetListQueryDto) {
    return this.findBudgetsUseCase.execute(input);
  }

  /** List expenditures. */
  findExpenditures(input: ExpenditureListQueryDto) {
    return this.findExpendituresUseCase.execute(input);
  }

  /** List fiscal years. */
  findFiscalYears(input: FiscalYearListQueryDto) {
    return this.findFiscalYearsUseCase.execute(input);
  }

  /** List ledger entries. */
  findLedgerEntries(input: LedgerEntryListQueryDto) {
    return this.findLedgerEntriesUseCase.execute(input);
  }

  /** List revenue records. */
  findRevenueRecords(input: RevenueRecordListQueryDto) {
    return this.findRevenueRecordsUseCase.execute(input);
  }

  /** List transfers. */
  findTransfers(input: TransferListQueryDto) {
    return this.findTransfersUseCase.execute(input);
  }

  /** Get budgets by id. */
  getBudgetById(input: { budgetId: string }) {
    return this.getBudgetByIdUseCase.execute(input);
  }

  /** Get budgetary units by id. */
  getBudgetaryUnitById(input: { unitId: string }) {
    return this.getBudgetaryUnitByIdUseCase.execute(input);
  }

  /** Get expenditures by id. */
  getExpenditureById(input: { expenditureId: string }) {
    return this.getExpenditureByIdUseCase.execute(input);
  }

  /** Get fiscal years by id. */
  getFiscalYearById(input: { fiscalYearId: string }) {
    return this.getFiscalYearByIdUseCase.execute(input);
  }

  /** Get ledger entries by id. */
  getLedgerEntryById(input: { entryId: string }) {
    return this.getLedgerEntryByIdUseCase.execute(input);
  }

  /** Get revenue records by id. */
  getRevenueRecordById(input: { revenueId: string }) {
    return this.getRevenueRecordByIdUseCase.execute(input);
  }

  /** Get transfers by id. */
  getTransferById(input: { transferId: string }) {
    return this.getTransferByIdUseCase.execute(input);
  }
}