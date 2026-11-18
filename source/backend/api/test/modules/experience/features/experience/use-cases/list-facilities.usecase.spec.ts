import { describe, expect, it } from "vitest";

import { ListFacilitiesUseCase } from "#/modules/experience/features/experience/use-cases/list-facilities.usecase";

/**
 * Civic infrastructure and offices by class and place: schools, hospitals, police stations, county and constituency offices, polling stations, with capacity and coordinates.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe("ListFacilitiesUseCase", () => {
  it("can be constructed", () => {
    const args = [] as unknown as ConstructorParameters<typeof ListFacilitiesUseCase>;
    expect(new ListFacilitiesUseCase(...args)).toBeInstanceOf(ListFacilitiesUseCase);
  });

  it.todo(
    "Civic infrastructure and offices by class and place: schools, hospitals, police stations, county and constituency offices, polling stations, with capacity and coordinates.",
  );
});
