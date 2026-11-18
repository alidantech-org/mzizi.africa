import { describe, expect, it } from "vitest";

import { GetPlaceElectionsUseCase } from "#/modules/insights/features/insights/use-cases/get-place-elections.usecase";

/**
 * Elections in a place over time: who won, with what votes, turnout and the registration trend.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe("GetPlaceElectionsUseCase", () => {
  it("can be constructed", () => {
    const args = [] as unknown as ConstructorParameters<typeof GetPlaceElectionsUseCase>;
    expect(new GetPlaceElectionsUseCase(...args)).toBeInstanceOf(GetPlaceElectionsUseCase);
  });

  it.todo(
    "Elections in a place over time: who won, with what votes, turnout and the registration trend.",
  );
});
