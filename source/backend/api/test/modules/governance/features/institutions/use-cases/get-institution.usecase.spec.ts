import { describe, expect, it } from "vitest";

import { GetInstitutionUseCase } from "#/modules/governance/features/institutions/use-cases/get-institution.usecase";

/**
 * One institution with its mandates and offices.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe("GetInstitutionUseCase", () => {
  it("can be constructed", () => {
    const args = [] as unknown as ConstructorParameters<typeof GetInstitutionUseCase>;
    expect(new GetInstitutionUseCase(...args)).toBeInstanceOf(GetInstitutionUseCase);
  });

  it.todo("One institution with its mandates and offices.");
  it.todo("fails with Not Found (404)");
});
