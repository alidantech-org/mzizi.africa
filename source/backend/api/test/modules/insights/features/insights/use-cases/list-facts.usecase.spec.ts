import { describe, expect, it } from "vitest";

import { ListFactsUseCase } from "#/modules/insights/features/insights/use-cases/list-facts.usecase";

/**
 * Did-you-know facts about the country, and those tagged to a place and the places above it.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe("ListFactsUseCase", () => {
  it("can be constructed", () => {
    const args = [] as unknown as ConstructorParameters<typeof ListFactsUseCase>;
    expect(new ListFactsUseCase(...args)).toBeInstanceOf(ListFactsUseCase);
  });

  it.todo(
    "Did-you-know facts about the country, and those tagged to a place and the places above it.",
  );
});
