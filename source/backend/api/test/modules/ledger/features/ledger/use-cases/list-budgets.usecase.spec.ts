import { describe, expect, it } from "vitest";

import { ListBudgetsUseCase } from "#/modules/ledger/features/ledger/use-cases/list-budgets.usecase";

/**
 * Budgets by fiscal year with their revisions, newest first.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe("ListBudgetsUseCase", () => {
  it("can be constructed", () => {
    const args = [] as unknown as ConstructorParameters<typeof ListBudgetsUseCase>;
    expect(new ListBudgetsUseCase(...args)).toBeInstanceOf(ListBudgetsUseCase);
  });

  it.todo("Budgets by fiscal year with their revisions, newest first.");
});
