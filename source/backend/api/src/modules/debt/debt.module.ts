import { Module } from "@nestjs/common";
import { DebtDebtReadModule } from "#/modules/debt/debt-read/debt-read.module.ts";

@Module({
  imports: [
    DebtDebtReadModule,
  ],
})
export class DebtModule {}