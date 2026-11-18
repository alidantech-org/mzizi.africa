import { describe, expect, it } from "vitest";

import { GetGovernanceTabsUseCase } from "#/modules/insights/features/insights/use-cases/get-governance-tabs.usecase";

/**
 * The ways to look at leaders (elected, nominated, appointed) and the bodies to switch to, all read from the reference schemes.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe("GetGovernanceTabsUseCase", () => {
  it("can be constructed", () => {
    const args = [] as unknown as ConstructorParameters<typeof GetGovernanceTabsUseCase>;
    expect(new GetGovernanceTabsUseCase(...args)).toBeInstanceOf(GetGovernanceTabsUseCase);
  });

  it.todo(
    "The ways to look at leaders (elected, nominated, appointed) and the bodies to switch to, all read from the reference schemes.",
  );
});
