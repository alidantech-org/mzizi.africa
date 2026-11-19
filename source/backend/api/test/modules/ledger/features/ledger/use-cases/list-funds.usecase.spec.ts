import { describe, expect, it } from "vitest";

import { ListFundsUseCase } from "#/modules/ledger/features/ledger/use-cases/list-funds.usecase";

/**
 * Funds with who manages them, where they apply and how many money flows are recorded.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe("ListFundsUseCase", () => {
  it("can be constructed", () => {
    const args = [] as unknown as ConstructorParameters<typeof ListFundsUseCase>;
    expect(new ListFundsUseCase(...args)).toBeInstanceOf(ListFundsUseCase);
  });

  it.todo("Funds with who manages them, where they apply and how many money flows are recorded.");
});
