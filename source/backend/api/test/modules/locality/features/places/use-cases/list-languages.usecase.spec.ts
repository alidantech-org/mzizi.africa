import { describe, expect, it } from "vitest";

import { ListLanguagesUseCase } from "#/modules/locality/features/places/use-cases/list-languages.usecase";

/**
 * The languages the system can serve names and labels in, for a language picker.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe("ListLanguagesUseCase", () => {
  it("can be constructed", () => {
    const args = [] as unknown as ConstructorParameters<typeof ListLanguagesUseCase>;
    expect(new ListLanguagesUseCase(...args)).toBeInstanceOf(ListLanguagesUseCase);
  });

  it.todo("The languages the system can serve names and labels in, for a language picker.");
});
