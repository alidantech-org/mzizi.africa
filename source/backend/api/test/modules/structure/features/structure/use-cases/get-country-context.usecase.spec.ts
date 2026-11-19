import { describe, expect, it } from "vitest";

import { GetCountryContextUseCase } from "#/modules/structure/features/structure/use-cases/get-country-context.usecase";

/**
 * Explicit country identity and recorded routing roots; no default-country inference.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe("GetCountryContextUseCase", () => {
  it("can be constructed", () => {
    const args = [] as unknown as ConstructorParameters<typeof GetCountryContextUseCase>;
    expect(new GetCountryContextUseCase(...args)).toBeInstanceOf(GetCountryContextUseCase);
  });

  it.todo("Explicit country identity and recorded routing roots; no default-country inference.");
  it.todo("fails with Not Found (404)");
});
