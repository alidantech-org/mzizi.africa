import { Module } from "@nestjs/common";
import { FinanceBudgetsModule } from "#/modules/finance/features/budgets/budgets.module.ts";

@Module({
  imports: [FinanceBudgetsModule],
})
export class FinanceModule {}
