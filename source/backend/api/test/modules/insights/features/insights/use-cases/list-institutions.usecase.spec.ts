import { describe, expect, it } from "vitest";

import { ListInstitutionsUseCase } from "#/modules/insights/features/insights/use-cases/list-institutions.usecase";

/**
 * Every public body grouped by arm of government and kind, with what created it and how many leaders it has. The groups and labels come from the reference schemes.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe("ListInstitutionsUseCase", () => {
  it("can be constructed", () => {
    const args = [] as unknown as ConstructorParameters<typeof ListInstitutionsUseCase>;
    expect(new ListInstitutionsUseCase(...args)).toBeInstanceOf(ListInstitutionsUseCase);
  });

  it.todo(
    "Every public body grouped by arm of government and kind, with what created it and how many leaders it has. The groups and labels come from the reference schemes.",
  );
});
