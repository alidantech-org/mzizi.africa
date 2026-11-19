import { describe, expect, it } from "vitest";

import { ListLawUseCase } from "#/modules/insights/features/insights/use-cases/list-law.usecase";

/**
 * Legal instruments held, highest authority first (constitution, then acts, then regulations), with their size.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe("ListLawUseCase", () => {
  it("can be constructed", () => {
    const args = [] as unknown as ConstructorParameters<typeof ListLawUseCase>;
    expect(new ListLawUseCase(...args)).toBeInstanceOf(ListLawUseCase);
  });

  it.todo(
    "Legal instruments held, highest authority first (constitution, then acts, then regulations), with their size.",
  );
});
