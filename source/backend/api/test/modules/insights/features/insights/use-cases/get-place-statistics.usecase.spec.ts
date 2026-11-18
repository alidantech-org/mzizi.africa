import { describe, expect, it } from "vitest";

import { GetPlaceStatisticsUseCase } from "#/modules/insights/features/insights/use-cases/get-place-statistics.usecase";

/**
 * Population and other statistics of a place, by topic, with history, breakdowns and comparison to its parents.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe("GetPlaceStatisticsUseCase", () => {
  it("can be constructed", () => {
    const args = [] as unknown as ConstructorParameters<typeof GetPlaceStatisticsUseCase>;
    expect(new GetPlaceStatisticsUseCase(...args)).toBeInstanceOf(GetPlaceStatisticsUseCase);
  });

  it.todo(
    "Population and other statistics of a place, by topic, with history, breakdowns and comparison to its parents.",
  );
});
