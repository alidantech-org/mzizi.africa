import { Module, type Type } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BudgetEntity } from "#/modules/finance/entities/budget.entity.ts";
import { BudgetaryUnitEntity } from "#/modules/finance/entities/budgetary-unit.entity.ts";
import { ExpenditureEntity } from "#/modules/finance/entities/expenditure.entity.ts";
import { FiscalYearEntity } from "#/modules/finance/entities/fiscal-year.entity.ts";
import { LedgerEntryEntity } from "#/modules/finance/entities/ledger-entry.entity.ts";
import { RevenueRecordEntity } from "#/modules/finance/entities/revenue-record.entity.ts";
import { TransferEntity } from "#/modules/finance/entities/transfer.entity.ts";
import { FinanceFinanceReadServiceImpl } from "#/modules/finance/finance-read/finance-read.service.impl.ts";
import { FindBudgetaryUnitsUseCase } from "#/modules/finance/finance-read/use-cases/find-budgetary-units.usecase.ts";
import { FindBudgetsUseCase } from "#/modules/finance/finance-read/use-cases/find-budgets.usecase.ts";
import { FindExpendituresUseCase } from "#/modules/finance/finance-read/use-cases/find-expenditures.usecase.ts";
import { FindFiscalYearsUseCase } from "#/modules/finance/finance-read/use-cases/find-fiscal-years.usecase.ts";
import { FindLedgerEntriesUseCase } from "#/modules/finance/finance-read/use-cases/find-ledger-entries.usecase.ts";
import { FindRevenueRecordsUseCase } from "#/modules/finance/finance-read/use-cases/find-revenue-records.usecase.ts";
import { FindTransfersUseCase } from "#/modules/finance/finance-read/use-cases/find-transfers.usecase.ts";
import { GetBudgetByIdUseCase } from "#/modules/finance/finance-read/use-cases/get-budget-by-id.usecase.ts";
import { GetBudgetaryUnitByIdUseCase } from "#/modules/finance/finance-read/use-cases/get-budgetary-unit-by-id.usecase.ts";
import { GetExpenditureByIdUseCase } from "#/modules/finance/finance-read/use-cases/get-expenditure-by-id.usecase.ts";
import { GetFiscalYearByIdUseCase } from "#/modules/finance/finance-read/use-cases/get-fiscal-year-by-id.usecase.ts";
import { GetLedgerEntryByIdUseCase } from "#/modules/finance/finance-read/use-cases/get-ledger-entry-by-id.usecase.ts";
import { GetRevenueRecordByIdUseCase } from "#/modules/finance/finance-read/use-cases/get-revenue-record-by-id.usecase.ts";
import { GetTransferByIdUseCase } from "#/modules/finance/finance-read/use-cases/get-transfer-by-id.usecase.ts";

import { FinanceFinanceReadController } from "./finance-read.controller.ts";
import { FinanceFinanceReadService } from "./finance-read.service.ts";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BudgetEntity,
      BudgetaryUnitEntity,
      ExpenditureEntity,
      FiscalYearEntity,
      LedgerEntryEntity,
      RevenueRecordEntity,
      TransferEntity,
    ]),
  ],
  controllers: [FinanceFinanceReadController],
  providers: [
    {
      provide: FinanceFinanceReadService,
      useClass: FinanceFinanceReadServiceImpl satisfies Type<FinanceFinanceReadService>,
    },
    FindBudgetaryUnitsUseCase,
    FindBudgetsUseCase,
    FindExpendituresUseCase,
    FindFiscalYearsUseCase,
    FindLedgerEntriesUseCase,
    FindRevenueRecordsUseCase,
    FindTransfersUseCase,
    GetBudgetByIdUseCase,
    GetBudgetaryUnitByIdUseCase,
    GetExpenditureByIdUseCase,
    GetFiscalYearByIdUseCase,
    GetLedgerEntryByIdUseCase,
    GetRevenueRecordByIdUseCase,
    GetTransferByIdUseCase,
  ],
  exports: [FinanceFinanceReadService],
})
export class FinanceFinanceReadModule {}