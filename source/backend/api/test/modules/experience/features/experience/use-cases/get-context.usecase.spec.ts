import { describe, expect, it } from "vitest";

import { GetContextUseCase } from "#/modules/experience/features/experience/use-cases/get-context.usecase";

/**
 * Who and where the visitor is: the country and how it was decided, the language, the place resolved from the clean address path, the levels of the country's ladder and the countries that can be chosen.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe("GetContextUseCase", () => {
  it("can be constructed", () => {
    const args = [] as unknown as ConstructorParameters<typeof GetContextUseCase>;
    expect(new GetContextUseCase(...args)).toBeInstanceOf(GetContextUseCase);
  });

  it.todo(
    "Who and where the visitor is: the country and how it was decided, the language, the place resolved from the clean address path, the levels of the country\u0027s ladder and the countries that can be chosen.",
  );
});
