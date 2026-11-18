import { describe, expect, it } from "vitest";

import { GetCopyUseCase } from "#/modules/experience/features/experience/use-cases/get-copy.usecase";

/**
 * The interface wording for one language, with the country's own wording where it differs. Screens declare copy keys; the words are delivered from here.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe("GetCopyUseCase", () => {
  it("can be constructed", () => {
    const args = [] as unknown as ConstructorParameters<typeof GetCopyUseCase>;
    expect(new GetCopyUseCase(...args)).toBeInstanceOf(GetCopyUseCase);
  });

  it.todo(
    "The interface wording for one language, with the country\u0027s own wording where it differs. Screens declare copy keys; the words are delivered from here.",
  );
});
