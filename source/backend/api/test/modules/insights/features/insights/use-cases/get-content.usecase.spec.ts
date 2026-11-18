import { describe, expect, it } from "vitest";

import { GetContentUseCase } from "#/modules/insights/features/insights/use-cases/get-content.usecase";

/**
 * One explanatory text by its address or by the record it is about, with image references resolved to addresses.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe("GetContentUseCase", () => {
  it("can be constructed", () => {
    const args = [] as unknown as ConstructorParameters<typeof GetContentUseCase>;
    expect(new GetContentUseCase(...args)).toBeInstanceOf(GetContentUseCase);
  });

  it.todo(
    "One explanatory text by its address or by the record it is about, with image references resolved to addresses.",
  );
});
