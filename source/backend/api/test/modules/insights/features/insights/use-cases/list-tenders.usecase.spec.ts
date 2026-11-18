import { describe, expect, it } from "vitest";

import { ListTendersUseCase } from "#/modules/insights/features/insights/use-cases/list-tenders.usecase";

/**
 * Tenders and contracts: open, ongoing, closed, awarded and complete, with suppliers, plus transparency information.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe("ListTendersUseCase", () => {
  it("can be constructed", () => {
    const args = [] as unknown as ConstructorParameters<typeof ListTendersUseCase>;
    expect(new ListTendersUseCase(...args)).toBeInstanceOf(ListTendersUseCase);
  });

  it.todo(
    "Tenders and contracts: open, ongoing, closed, awarded and complete, with suppliers, plus transparency information.",
  );
});
