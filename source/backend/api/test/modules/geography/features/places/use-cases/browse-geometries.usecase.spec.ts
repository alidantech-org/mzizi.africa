import { describe, expect, it } from "vitest";

import { BrowseGeometriesUseCase } from "#/modules/geography/features/places/use-cases/browse-geometries.usecase";

/**
 * The current drawings whose envelope meets a map's bounds and whose zoom range includes the zoom, optionally of one feature type and simplified to a tolerance.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe("BrowseGeometriesUseCase", () => {
  it("can be constructed", () => {
    const args = [] as unknown as ConstructorParameters<typeof BrowseGeometriesUseCase>;
    expect(new BrowseGeometriesUseCase(...args)).toBeInstanceOf(BrowseGeometriesUseCase);
  });

  it.todo(
    "The current drawings whose envelope meets a map\u0027s bounds and whose zoom range includes the zoom, optionally of one feature type and simplified to a tolerance.",
  );
});
