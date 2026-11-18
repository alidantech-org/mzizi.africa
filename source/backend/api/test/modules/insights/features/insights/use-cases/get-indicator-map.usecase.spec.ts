import { describe, expect, it } from "vitest";

import { GetIndicatorMapUseCase } from "#/modules/insights/features/insights/use-cases/get-indicator-map.usecase";

/**
 * One indicator's latest value for each unit under a parent, for a heat map.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe("GetIndicatorMapUseCase", () => {
  it("can be constructed", () => {
    const args = [] as unknown as ConstructorParameters<typeof GetIndicatorMapUseCase>;
    expect(new GetIndicatorMapUseCase(...args)).toBeInstanceOf(GetIndicatorMapUseCase);
  });

  it.todo("One indicator\u0027s latest value for each unit under a parent, for a heat map.");
});
