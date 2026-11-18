import { describe, expect, it } from "vitest";

import { GetLeaderTreeUseCase } from "#/modules/insights/features/insights/use-cases/get-leader-tree.usecase";

/**
 * The leaders above and at a place, as a family tree: national first, then county, constituency and ward, split into elected, appointed and nominated.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe("GetLeaderTreeUseCase", () => {
  it("can be constructed", () => {
    const args = [] as unknown as ConstructorParameters<typeof GetLeaderTreeUseCase>;
    expect(new GetLeaderTreeUseCase(...args)).toBeInstanceOf(GetLeaderTreeUseCase);
  });

  it.todo(
    "The leaders above and at a place, as a family tree: national first, then county, constituency and ward, split into elected, appointed and nominated.",
  );
});
