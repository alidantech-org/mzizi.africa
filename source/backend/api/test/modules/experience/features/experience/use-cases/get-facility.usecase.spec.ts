import { describe, expect, it } from "vitest";

import { GetFacilityUseCase } from "#/modules/experience/features/experience/use-cases/get-facility.usecase";

/**
 * One facility with its capacity, the places it is in and the polling stations it hosts.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe("GetFacilityUseCase", () => {
  it("can be constructed", () => {
    const args = [] as unknown as ConstructorParameters<typeof GetFacilityUseCase>;
    expect(new GetFacilityUseCase(...args)).toBeInstanceOf(GetFacilityUseCase);
  });

  it.todo("One facility with its capacity, the places it is in and the polling stations it hosts.");
});
