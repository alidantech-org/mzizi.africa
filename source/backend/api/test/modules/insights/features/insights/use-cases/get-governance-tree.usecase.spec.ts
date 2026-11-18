import { describe, expect, it } from "vitest";

import { GetGovernanceTreeUseCase } from "#/modules/insights/features/insights/use-cases/get-governance-tree.usecase";

/**
 * A tree of leaders for one tab or one body: nodes with their tier, how they got the seat, a performance bar and the reference codes behind them; edges from superior to deputy or body to member; and a side rail of the levels of government.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe("GetGovernanceTreeUseCase", () => {
  it("can be constructed", () => {
    const args = [] as unknown as ConstructorParameters<typeof GetGovernanceTreeUseCase>;
    expect(new GetGovernanceTreeUseCase(...args)).toBeInstanceOf(GetGovernanceTreeUseCase);
  });

  it.todo(
    "A tree of leaders for one tab or one body: nodes with their tier, how they got the seat, a performance bar and the reference codes behind them; edges from superior to deputy or body to member; and a side rail of the levels of government.",
  );
});
