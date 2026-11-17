import { describe, expect, it } from "vitest";

import { BrowseFeatureKindsUseCase } from "#/modules/geography/features/places/use-cases/browse-feature-kinds.usecase";

/**
 * The kinds a geographic feature can have, in code order, for choosing a feature type.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe("BrowseFeatureKindsUseCase", () => {
  it("can be constructed", () => {
    const args = [] as unknown as ConstructorParameters<typeof BrowseFeatureKindsUseCase>;
    expect(new BrowseFeatureKindsUseCase(...args)).toBeInstanceOf(BrowseFeatureKindsUseCase);
  });

  it.todo("The kinds a geographic feature can have, in code order, for choosing a feature type.");
});
