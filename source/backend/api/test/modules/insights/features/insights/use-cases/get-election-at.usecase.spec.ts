import { describe, expect, it } from "vitest";

import { GetElectionAtUseCase } from "#/modules/insights/features/insights/use-cases/get-election-at.usecase";

/**
 * One election with its contests and results by unit under a place named by its readable address.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe("GetElectionAtUseCase", () => {
  it("can be constructed", () => {
    const args = [] as unknown as ConstructorParameters<typeof GetElectionAtUseCase>;
    expect(new GetElectionAtUseCase(...args)).toBeInstanceOf(GetElectionAtUseCase);
  });

  it.todo(
    "One election with its contests and results by unit under a place named by its readable address.",
  );
});
