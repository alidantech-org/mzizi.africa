import { describe, expect, it } from "vitest";

import { BrowsePlacesUseCase } from "#/modules/insights/features/insights/use-cases/browse-places.usecase";

/**
 * The country's hierarchy one level at a time (county, constituency, ward, town, village), with the path to the current unit.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe("BrowsePlacesUseCase", () => {
  it("can be constructed", () => {
    const args = [] as unknown as ConstructorParameters<typeof BrowsePlacesUseCase>;
    expect(new BrowsePlacesUseCase(...args)).toBeInstanceOf(BrowsePlacesUseCase);
  });

  it.todo(
    "The country\u0027s hierarchy one level at a time (county, constituency, ward, town, village), with the path to the current unit.",
  );
});
