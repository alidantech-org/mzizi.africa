import { describe, expect, it } from "vitest";

import { GetLegalBasisUseCase } from "#/modules/insights/features/insights/use-cases/get-legal-basis.usecase";

/**
 * The Constitution articles and Acts that establish, authorise or govern one record (a body, an office, a place).
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe("GetLegalBasisUseCase", () => {
  it("can be constructed", () => {
    const args = [] as unknown as ConstructorParameters<typeof GetLegalBasisUseCase>;
    expect(new GetLegalBasisUseCase(...args)).toBeInstanceOf(GetLegalBasisUseCase);
  });

  it.todo(
    "The Constitution articles and Acts that establish, authorise or govern one record (a body, an office, a place).",
  );
});
