import { Module } from "@nestjs/common";
import { LedgerLedgerModule } from "#/modules/ledger/features/ledger/ledger.module.ts";

@Module({
  imports: [LedgerLedgerModule],
})
export class LedgerModule {}
