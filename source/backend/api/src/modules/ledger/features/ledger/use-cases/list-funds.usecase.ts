import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import type { FundListDto } from "#/modules/ledger/schema/dto/fund-list.dto";
import type { LedgerInputDto } from "#/modules/ledger/schema/dto/ledger-input.dto";
import { funds } from "#/modules/ledger/features/ledger/reads.ts";

/**
 * Funds with who manages them, where they apply and how many money flows are recorded.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Write the use case here.
 */
@Injectable()
export class ListFundsUseCase {
  constructor(private readonly db: DataSource) {}

  async execute(input: LedgerInputDto): Promise<FundListDto> {
    return (await funds(this.db, input.limit ?? 100)) as unknown as FundListDto;
  }
}
