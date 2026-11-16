import { describe, expect, it } from "vitest";

import { BrowseFeaturesUseCase } from "#/modules/geography/features/places/use-cases/browse-features.usecase";

/**
 * Browse geographic features with their names, optionally of one type or by code prefix.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe("BrowseFeaturesUseCase", () => {
  it("can be constructed", () => {
    const args = [] as unknown as ConstructorParameters<typeof BrowseFeaturesUseCase>;
    expect(new BrowseFeaturesUseCase(...args)).toBeInstanceOf(BrowseFeaturesUseCase);
  });

  it.todo("Browse geographic features with their names, optionally of one type or by code prefix.");
});
