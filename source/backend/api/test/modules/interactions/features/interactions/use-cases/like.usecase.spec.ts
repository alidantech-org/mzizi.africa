import { describe, expect, it } from "vitest";

import { LikeUseCase } from "#/modules/interactions/features/interactions/use-cases/like.usecase";

/**
 * This device likes a subject; liking twice changes nothing.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe("LikeUseCase", () => {
  it("can be constructed", () => {
    const args = [] as unknown as ConstructorParameters<typeof LikeUseCase>;
    expect(new LikeUseCase(...args)).toBeInstanceOf(LikeUseCase);
  });

  it.todo("This device likes a subject; liking twice changes nothing.");
});
