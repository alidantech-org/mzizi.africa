import { describe, expect, it } from "vitest";

import { GetComparisonUseCase } from "#/modules/insights/features/insights/use-cases/get-comparison.usecase";

/**
 * Two places on the same figures, aligned, with the difference in percent.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe("GetComparisonUseCase", () => {
  it("can be constructed", () => {
    const args = [] as unknown as ConstructorParameters<typeof GetComparisonUseCase>;
    expect(new GetComparisonUseCase(...args)).toBeInstanceOf(GetComparisonUseCase);
  });

  it.todo("Two places on the same figures, aligned, with the difference in percent.");
});
