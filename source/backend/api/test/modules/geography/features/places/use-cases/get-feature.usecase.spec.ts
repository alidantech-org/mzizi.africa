import { describe, expect, it } from "vitest";

import { GetFeatureUseCase } from "#/modules/geography/features/places/use-cases/get-feature.usecase";

/**
 * One geographic feature with its names.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe("GetFeatureUseCase", () => {
  it("can be constructed", () => {
    const args = [] as unknown as ConstructorParameters<typeof GetFeatureUseCase>;
    expect(new GetFeatureUseCase(...args)).toBeInstanceOf(GetFeatureUseCase);
  });

  it.todo("One geographic feature with its names.");
  it.todo("fails with Not Found (404)");
});
