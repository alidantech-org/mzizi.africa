import { describe, expect, it } from "vitest";

import { GetPlaceCivicUseCase } from "#/modules/insights/features/insights/use-cases/get-place-civic.usecase";

/**
 * Civic delivery in a place: fund allocations and spending by class and year, projects with locations, infrastructure and leadership.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe("GetPlaceCivicUseCase", () => {
  it("can be constructed", () => {
    const args = [] as unknown as ConstructorParameters<typeof GetPlaceCivicUseCase>;
    expect(new GetPlaceCivicUseCase(...args)).toBeInstanceOf(GetPlaceCivicUseCase);
  });

  it.todo(
    "Civic delivery in a place: fund allocations and spending by class and year, projects with locations, infrastructure and leadership.",
  );
});
