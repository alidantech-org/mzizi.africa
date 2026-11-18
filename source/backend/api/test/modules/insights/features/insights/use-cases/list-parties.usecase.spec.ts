import { describe, expect, it } from "vitest";

import { ListPartiesUseCase } from "#/modules/insights/features/insights/use-cases/list-parties.usecase";

/**
 * Political parties ranked by members, votes and fund allocation.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe("ListPartiesUseCase", () => {
  it("can be constructed", () => {
    const args = [] as unknown as ConstructorParameters<typeof ListPartiesUseCase>;
    expect(new ListPartiesUseCase(...args)).toBeInstanceOf(ListPartiesUseCase);
  });

  it.todo("Political parties ranked by members, votes and fund allocation.");
});
