import { describe, expect, it } from "vitest";

import { GetInstitutionUseCase } from "#/modules/insights/features/insights/use-cases/get-institution.usecase";

/**
 * One body: what it is for, what created it (with the Constitution articles or Acts), who leads it, the bodies it belongs to and oversees, and explanatory texts.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe("GetInstitutionUseCase", () => {
  it("can be constructed", () => {
    const args = [] as unknown as ConstructorParameters<typeof GetInstitutionUseCase>;
    expect(new GetInstitutionUseCase(...args)).toBeInstanceOf(GetInstitutionUseCase);
  });

  it.todo(
    "One body: what it is for, what created it (with the Constitution articles or Acts), who leads it, the bodies it belongs to and oversees, and explanatory texts.",
  );
});
