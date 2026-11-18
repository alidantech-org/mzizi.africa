import { describe, expect, it } from "vitest";

import { GetCompareOptionsUseCase } from "#/modules/insights/features/insights/use-cases/get-compare-options.usecase";

/**
 * Places worth comparing a place with: the ten closest by geography, the ten top performers, and the ladder of the units above it, saying plainly which rungs do not exist.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe("GetCompareOptionsUseCase", () => {
  it("can be constructed", () => {
    const args = [] as unknown as ConstructorParameters<typeof GetCompareOptionsUseCase>;
    expect(new GetCompareOptionsUseCase(...args)).toBeInstanceOf(GetCompareOptionsUseCase);
  });

  it.todo(
    "Places worth comparing a place with: the ten closest by geography, the ten top performers, and the ladder of the units above it, saying plainly which rungs do not exist.",
  );
});
