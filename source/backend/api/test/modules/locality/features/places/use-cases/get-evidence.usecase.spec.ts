import { describe, expect, it } from "vitest";

import { GetEvidenceUseCase } from "#/modules/locality/features/places/use-cases/get-evidence.usecase";

/**
 * One citation with its source, edition, quoted text and the files it points at.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe("GetEvidenceUseCase", () => {
  it("can be constructed", () => {
    const args = [] as unknown as ConstructorParameters<typeof GetEvidenceUseCase>;
    expect(new GetEvidenceUseCase(...args)).toBeInstanceOf(GetEvidenceUseCase);
  });

  it.todo("One citation with its source, edition, quoted text and the files it points at.");
});
