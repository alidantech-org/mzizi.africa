import { describe, expect, it } from "vitest";

import { UnlikeUseCase } from "#/modules/interactions/features/interactions/use-cases/unlike.usecase";

/**
 * This device withdraws its like.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe("UnlikeUseCase", () => {
  it("can be constructed", () => {
    const args = [] as unknown as ConstructorParameters<typeof UnlikeUseCase>;
    expect(new UnlikeUseCase(...args)).toBeInstanceOf(UnlikeUseCase);
  });

  it.todo("This device withdraws its like.");
});
