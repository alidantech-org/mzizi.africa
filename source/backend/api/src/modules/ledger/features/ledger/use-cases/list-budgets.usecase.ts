import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import type { BudgetListDto } from "#/modules/ledger/schema/dto/budget-list.dto";
import type { LedgerInputDto } from "#/modules/ledger/schema/dto/ledger-input.dto";
import { budgets } from "#/modules/ledger/features/ledger/reads.ts";

/**
 * Budgets by fiscal year with their revisions, newest first.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Write the use case here.
 */
@Injectable()
export class ListBudgetsUseCase {
  constructor(private readonly db: DataSource) {}

  async execute(input: LedgerInputDto): Promise<BudgetListDto> {
    return (await budgets(this.db, input.limit ?? 100)) as unknown as BudgetListDto;
  }
}
