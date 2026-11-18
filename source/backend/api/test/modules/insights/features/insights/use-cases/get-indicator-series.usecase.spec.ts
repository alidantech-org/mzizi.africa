import { describe, expect, it } from "vitest";

import { GetIndicatorSeriesUseCase } from "#/modules/insights/features/insights/use-cases/get-indicator-series.usecase";

/**
 * One indicator over time for one place, optionally broken down.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe("GetIndicatorSeriesUseCase", () => {
  it("can be constructed", () => {
    const args = [] as unknown as ConstructorParameters<typeof GetIndicatorSeriesUseCase>;
    expect(new GetIndicatorSeriesUseCase(...args)).toBeInstanceOf(GetIndicatorSeriesUseCase);
  });

  it.todo("One indicator over time for one place, optionally broken down.");
});
