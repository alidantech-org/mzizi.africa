import { describe, expect, it } from "vitest";

import { GetLeaderboardUseCase } from "#/modules/insights/features/insights/use-cases/get-leaderboard.usecase";

/**
 * Places (or leaders, parties) ranked by one metric, within a parent area and a level.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe("GetLeaderboardUseCase", () => {
  it("can be constructed", () => {
    const args = [] as unknown as ConstructorParameters<typeof GetLeaderboardUseCase>;
    expect(new GetLeaderboardUseCase(...args)).toBeInstanceOf(GetLeaderboardUseCase);
  });

  it.todo("Places (or leaders, parties) ranked by one metric, within a parent area and a level.");
});
