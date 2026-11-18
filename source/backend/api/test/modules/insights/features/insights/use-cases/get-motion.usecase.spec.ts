import { describe, expect, it } from "vitest";

import { GetMotionUseCase } from "#/modules/insights/features/insights/use-cases/get-motion.usecase";

/**
 * One motion with the position of every member (yes, no, abstained, absent), the law or budget it concerns and the tally.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe("GetMotionUseCase", () => {
  it("can be constructed", () => {
    const args = [] as unknown as ConstructorParameters<typeof GetMotionUseCase>;
    expect(new GetMotionUseCase(...args)).toBeInstanceOf(GetMotionUseCase);
  });

  it.todo(
    "One motion with the position of every member (yes, no, abstained, absent), the law or budget it concerns and the tally.",
  );
});
