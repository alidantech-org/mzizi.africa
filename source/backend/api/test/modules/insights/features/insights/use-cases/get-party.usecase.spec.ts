import { describe, expect, it } from "vitest";

import { GetPartyUseCase } from "#/modules/insights/features/insights/use-cases/get-party.usecase";

/**
 * One party: members list, votes obtained by election and fund allocation.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe("GetPartyUseCase", () => {
  it("can be constructed", () => {
    const args = [] as unknown as ConstructorParameters<typeof GetPartyUseCase>;
    expect(new GetPartyUseCase(...args)).toBeInstanceOf(GetPartyUseCase);
  });

  it.todo("One party: members list, votes obtained by election and fund allocation.");
});
