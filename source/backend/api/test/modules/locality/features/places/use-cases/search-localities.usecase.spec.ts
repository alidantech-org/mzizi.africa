import { describe, expect, it } from "vitest";

import { SearchLocalitiesUseCase } from "#/modules/locality/features/places/use-cases/search-localities.usecase";

/**
 * Places whose name matches the text, in any language, narrowest units first.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe("SearchLocalitiesUseCase", () => {
  it("can be constructed", () => {
    const args = [] as unknown as ConstructorParameters<typeof SearchLocalitiesUseCase>;
    expect(new SearchLocalitiesUseCase(...args)).toBeInstanceOf(SearchLocalitiesUseCase);
  });

  it.todo("Places whose name matches the text, in any language, narrowest units first.");
});
