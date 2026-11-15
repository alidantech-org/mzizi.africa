import { describe, expect, it } from "vitest";

import { GetOfficeUseCase } from "#/modules/governance/features/institutions/use-cases/get-office.usecase";

/**
 * One office with everyone who has held it, newest first.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe("GetOfficeUseCase", () => {
  it("can be constructed", () => {
    const args = [] as unknown as ConstructorParameters<typeof GetOfficeUseCase>;
    expect(new GetOfficeUseCase(...args)).toBeInstanceOf(GetOfficeUseCase);
  });

  it.todo("One office with everyone who has held it, newest first.");
  it.todo("fails with Not Found (404)");
});
