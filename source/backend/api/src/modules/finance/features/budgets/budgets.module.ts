import { Module, type Type } from "@nestjs/common";
import { ListAppropriationsUseCase } from "#/modules/finance/features/budgets/use-cases/list-appropriations.repository.ts";
import { ListBudgetsUseCase } from "#/modules/finance/features/budgets/use-cases/list-budgets.repository.ts";
import { ListFindingsUseCase } from "#/modules/finance/features/budgets/use-cases/list-findings.repository.ts";

import { FinanceBudgetsController } from "./budgets.controller.ts";
import { FinanceBudgetsService, FinanceBudgetsServiceImpl } from "./budgets.service.ts";

@Module({
  controllers: [FinanceBudgetsController],
  providers: [
    {
      provide: FinanceBudgetsService,
      useClass: FinanceBudgetsServiceImpl satisfies Type<FinanceBudgetsService>,
    },
    ListAppropriationsUseCase,
    ListBudgetsUseCase,
    ListFindingsUseCase,
  ],
  exports: [FinanceBudgetsService],
})
export class FinanceBudgetsModule {}
