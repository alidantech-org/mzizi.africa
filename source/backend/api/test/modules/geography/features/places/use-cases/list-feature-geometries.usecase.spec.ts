import { describe, expect, it } from "vitest";

import { ListFeatureGeometriesUseCase } from "#/modules/geography/features/places/use-cases/list-feature-geometries.usecase";

/**
 * The current drawings of one feature, each with its role, basis, revision, confidence, zoom range and validity. A feature with no drawing returns an empty list.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe("ListFeatureGeometriesUseCase", () => {
  it("can be constructed", () => {
    const args = [] as unknown as ConstructorParameters<typeof ListFeatureGeometriesUseCase>;
    expect(new ListFeatureGeometriesUseCase(...args)).toBeInstanceOf(ListFeatureGeometriesUseCase);
  });

  it.todo(
    "The current drawings of one feature, each with its role, basis, revision, confidence, zoom range and validity. A feature with no drawing returns an empty list.",
  );
});
