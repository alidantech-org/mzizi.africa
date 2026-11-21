import { describe, expect, it } from "vitest";

import { GetPlaceStatisticsAtUseCase } from "#/modules/insights/features/insights/use-cases/get-place-statistics-at.usecase";

/**
 * The same statistics as GetPlaceStatistics, for a place named by its readable address. The address is resolved on the server; no identity is sent.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe("GetPlaceStatisticsAtUseCase", () => {
  it("can be constructed", () => {
    const args = [] as unknown as ConstructorParameters<typeof GetPlaceStatisticsAtUseCase>;
    expect(new GetPlaceStatisticsAtUseCase(...args)).toBeInstanceOf(GetPlaceStatisticsAtUseCase);
  });

  it.todo(
    "The same statistics as GetPlaceStatistics, for a place named by its readable address. The address is resolved on the server; no identity is sent.",
  );
});
