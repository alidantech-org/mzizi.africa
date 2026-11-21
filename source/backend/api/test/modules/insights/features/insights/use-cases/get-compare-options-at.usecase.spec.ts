import { describe, expect, it } from "vitest";

import { GetCompareOptionsAtUseCase } from "#/modules/insights/features/insights/use-cases/get-compare-options-at.usecase";

/**
 * Compare options for a place named by its readable address: peers, nearby places, top places and the metrics offered.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe("GetCompareOptionsAtUseCase", () => {
  it("can be constructed", () => {
    const args = [] as unknown as ConstructorParameters<typeof GetCompareOptionsAtUseCase>;
    expect(new GetCompareOptionsAtUseCase(...args)).toBeInstanceOf(GetCompareOptionsAtUseCase);
  });

  it.todo(
    "Compare options for a place named by its readable address: peers, nearby places, top places and the metrics offered.",
  );
});
