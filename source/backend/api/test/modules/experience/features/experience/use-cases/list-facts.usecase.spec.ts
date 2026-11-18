import { describe, expect, it } from "vitest";

import { ListFactsUseCase } from "#/modules/experience/features/experience/use-cases/list-facts.usecase";

/**
 * Fun facts for the country and, with a place, for it and the places above it.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe("ListFactsUseCase", () => {
  it("can be constructed", () => {
    const args = [] as unknown as ConstructorParameters<typeof ListFactsUseCase>;
    expect(new ListFactsUseCase(...args)).toBeInstanceOf(ListFactsUseCase);
  });

  it.todo("Fun facts for the country and, with a place, for it and the places above it.");
});
