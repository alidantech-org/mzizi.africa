import { describe, expect, it } from "vitest";

import { ListMotionsUseCase } from "#/modules/insights/features/insights/use-cases/list-motions.usecase";

/**
 * Motions, bills and decisions of public bodies, newest first.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe("ListMotionsUseCase", () => {
  it("can be constructed", () => {
    const args = [] as unknown as ConstructorParameters<typeof ListMotionsUseCase>;
    expect(new ListMotionsUseCase(...args)).toBeInstanceOf(ListMotionsUseCase);
  });

  it.todo("Motions, bills and decisions of public bodies, newest first.");
});
