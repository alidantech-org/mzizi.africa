import { Module } from "@nestjs/common";
import { FinanceFinanceReadModule } from "#/modules/finance/finance-read/finance-read.module.ts";

@Module({
  imports: [
    FinanceFinanceReadModule,
  ],
})
export class FinanceModule {}