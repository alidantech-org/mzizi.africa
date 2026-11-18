import { describe, expect, it } from "vitest";

import { ListContentUseCase } from "#/modules/insights/features/insights/use-cases/list-content.usecase";

/**
 * Explanatory texts by category or tag, for the Learn section.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe("ListContentUseCase", () => {
  it("can be constructed", () => {
    const args = [] as unknown as ConstructorParameters<typeof ListContentUseCase>;
    expect(new ListContentUseCase(...args)).toBeInstanceOf(ListContentUseCase);
  });

  it.todo("Explanatory texts by category or tag, for the Learn section.");
});
