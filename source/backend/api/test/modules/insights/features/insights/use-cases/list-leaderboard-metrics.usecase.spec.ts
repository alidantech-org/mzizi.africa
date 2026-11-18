import { describe, expect, it } from "vitest";

import { ListLeaderboardMetricsUseCase } from "#/modules/insights/features/insights/use-cases/list-leaderboard-metrics.usecase";

/**
 * What places can be ranked by: statistics, finance, civic delivery, procurement and elections.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe("ListLeaderboardMetricsUseCase", () => {
  it("can be constructed", () => {
    const args = [] as unknown as ConstructorParameters<typeof ListLeaderboardMetricsUseCase>;
    expect(new ListLeaderboardMetricsUseCase(...args)).toBeInstanceOf(
      ListLeaderboardMetricsUseCase,
    );
  });

  it.todo(
    "What places can be ranked by: statistics, finance, civic delivery, procurement and elections.",
  );
});
