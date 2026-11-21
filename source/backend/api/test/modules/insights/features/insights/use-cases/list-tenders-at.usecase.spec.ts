import { describe, expect, it } from "vitest";

import { ListTendersAtUseCase } from "#/modules/insights/features/insights/use-cases/list-tenders-at.usecase";

/**
 * Tenders for a place named by its readable address (and the places inside it), or for the country when no place is named.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe("ListTendersAtUseCase", () => {
  it("can be constructed", () => {
    const args = [] as unknown as ConstructorParameters<typeof ListTendersAtUseCase>;
    expect(new ListTendersAtUseCase(...args)).toBeInstanceOf(ListTendersAtUseCase);
  });

  it.todo(
    "Tenders for a place named by its readable address (and the places inside it), or for the country when no place is named.",
  );
});
