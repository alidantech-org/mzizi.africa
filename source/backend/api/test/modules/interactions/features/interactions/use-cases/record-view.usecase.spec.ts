import { describe, expect, it } from "vitest";

import { RecordViewUseCase } from "#/modules/interactions/features/interactions/use-cases/record-view.usecase";

/**
 * A subject was viewed; one view per visitor per day.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe("RecordViewUseCase", () => {
  it("can be constructed", () => {
    const args = [] as unknown as ConstructorParameters<typeof RecordViewUseCase>;
    expect(new RecordViewUseCase(...args)).toBeInstanceOf(RecordViewUseCase);
  });

  it.todo("A subject was viewed; one view per visitor per day.");
});
