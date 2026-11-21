import { describe, expect, it } from "vitest";

import { GetPlaceCivicAtUseCase } from "#/modules/insights/features/insights/use-cases/get-place-civic-at.usecase";

/**
 * The same civic delivery as GetPlaceCivic, for a place named by its readable address. The address is resolved on the server; no identity is sent.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe("GetPlaceCivicAtUseCase", () => {
  it("can be constructed", () => {
    const args = [] as unknown as ConstructorParameters<typeof GetPlaceCivicAtUseCase>;
    expect(new GetPlaceCivicAtUseCase(...args)).toBeInstanceOf(GetPlaceCivicAtUseCase);
  });

  it.todo(
    "The same civic delivery as GetPlaceCivic, for a place named by its readable address. The address is resolved on the server; no identity is sent.",
  );
});
