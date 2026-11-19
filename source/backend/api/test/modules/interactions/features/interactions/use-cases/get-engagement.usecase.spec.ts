import { describe, expect, it } from "vitest";

import { GetEngagementUseCase } from "#/modules/interactions/features/interactions/use-cases/get-engagement.usecase";

/**
 * How many likes a subject has, and whether this device has liked it. Views are counted and not returned.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe("GetEngagementUseCase", () => {
  it("can be constructed", () => {
    const args = [] as unknown as ConstructorParameters<typeof GetEngagementUseCase>;
    expect(new GetEngagementUseCase(...args)).toBeInstanceOf(GetEngagementUseCase);
  });

  it.todo(
    "How many likes a subject has, and whether this device has liked it. Views are counted and not returned.",
  );
});
