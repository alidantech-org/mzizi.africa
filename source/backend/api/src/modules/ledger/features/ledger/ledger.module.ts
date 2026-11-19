import { Module, type Type } from "@nestjs/common";
import { LedgerLedgerRepository } from "#/modules/ledger/features/ledger/repositories/ledger.repository.ts";
import { GetCoverageUseCase } from "#/modules/ledger/features/ledger/use-cases/get-coverage.usecase.ts";
import { ListBudgetsUseCase } from "#/modules/ledger/features/ledger/use-cases/list-budgets.usecase.ts";
import { ListCoalitionsUseCase } from "#/modules/ledger/features/ledger/use-cases/list-coalitions.usecase.ts";
import { ListFundsUseCase } from "#/modules/ledger/features/ledger/use-cases/list-funds.usecase.ts";
import { ListManifestosUseCase } from "#/modules/ledger/features/ledger/use-cases/list-manifestos.usecase.ts";

import { LedgerLedgerController } from "./ledger.controller.ts";
import { LedgerLedgerService, LedgerLedgerServiceImpl } from "./ledger.service.ts";

@Module({
  controllers: [LedgerLedgerController],
  providers: [
    {
      provide: LedgerLedgerService,
      useClass: LedgerLedgerServiceImpl satisfies Type<LedgerLedgerService>,
    },
    GetCoverageUseCase,
    ListBudgetsUseCase,
    ListCoalitionsUseCase,
    ListFundsUseCase,
    ListManifestosUseCase,
    LedgerLedgerRepository,
  ],
  exports: [LedgerLedgerService],
})
export class LedgerLedgerModule {}
