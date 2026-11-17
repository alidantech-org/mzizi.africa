import { describe, expect, it } from "vitest";

import { GetLocalityUseCase } from "#/modules/locality/features/places/use-cases/get-locality.usecase";

/**
 * The same place document for a known feature, for visitors who pick a place by name instead of position.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe("GetLocalityUseCase", () => {
  it("can be constructed", () => {
    const args = [] as unknown as ConstructorParameters<typeof GetLocalityUseCase>;
    expect(new GetLocalityUseCase(...args)).toBeInstanceOf(GetLocalityUseCase);
  });

  it.todo(
    "The same place document for a known feature, for visitors who pick a place by name instead of position.",
  );
});
