import { describe, expect, it } from "vitest";

import { GetCoverageUseCase } from "#/modules/ledger/features/ledger/use-cases/get-coverage.usecase";

/**
 * What the platform expects to be published and what has been checked: the honest map of what is missing.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe("GetCoverageUseCase", () => {
  it("can be constructed", () => {
    const args = [] as unknown as ConstructorParameters<typeof GetCoverageUseCase>;
    expect(new GetCoverageUseCase(...args)).toBeInstanceOf(GetCoverageUseCase);
  });

  it.todo(
    "What the platform expects to be published and what has been checked: the honest map of what is missing.",
  );
});
