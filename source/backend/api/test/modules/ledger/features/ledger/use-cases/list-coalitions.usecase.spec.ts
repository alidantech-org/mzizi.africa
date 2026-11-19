import { describe, expect, it } from "vitest";

import { ListCoalitionsUseCase } from "#/modules/ledger/features/ledger/use-cases/list-coalitions.usecase";

/**
 * Coalitions of parties.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe("ListCoalitionsUseCase", () => {
  it("can be constructed", () => {
    const args = [] as unknown as ConstructorParameters<typeof ListCoalitionsUseCase>;
    expect(new ListCoalitionsUseCase(...args)).toBeInstanceOf(ListCoalitionsUseCase);
  });

  it.todo("Coalitions of parties.");
});
