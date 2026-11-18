import { describe, expect, it } from "vitest";

import { GetElectionUseCase } from "#/modules/insights/features/insights/use-cases/get-election.usecase";

/**
 * One election: its contests, and results by unit under a parent, for tables and heat maps.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe("GetElectionUseCase", () => {
  it("can be constructed", () => {
    const args = [] as unknown as ConstructorParameters<typeof GetElectionUseCase>;
    expect(new GetElectionUseCase(...args)).toBeInstanceOf(GetElectionUseCase);
  });

  it.todo(
    "One election: its contests, and results by unit under a parent, for tables and heat maps.",
  );
});
