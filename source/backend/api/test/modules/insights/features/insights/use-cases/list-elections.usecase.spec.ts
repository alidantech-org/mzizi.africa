import { describe, expect, it } from "vitest";

import { ListElectionsUseCase } from "#/modules/insights/features/insights/use-cases/list-elections.usecase";

/**
 * Every election the system knows, newest first.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe("ListElectionsUseCase", () => {
  it("can be constructed", () => {
    const args = [] as unknown as ConstructorParameters<typeof ListElectionsUseCase>;
    expect(new ListElectionsUseCase(...args)).toBeInstanceOf(ListElectionsUseCase);
  });

  it.todo("Every election the system knows, newest first.");
});
