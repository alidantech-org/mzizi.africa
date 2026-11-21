import { describe, expect, it } from "vitest";

import { GetComparisonAtUseCase } from "#/modules/insights/features/insights/use-cases/get-comparison-at.usecase";

/**
 * Two places of one country on the same figures, each named by its readable address.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe("GetComparisonAtUseCase", () => {
  it("can be constructed", () => {
    const args = [] as unknown as ConstructorParameters<typeof GetComparisonAtUseCase>;
    expect(new GetComparisonAtUseCase(...args)).toBeInstanceOf(GetComparisonAtUseCase);
  });

  it.todo("Two places of one country on the same figures, each named by its readable address.");
});
