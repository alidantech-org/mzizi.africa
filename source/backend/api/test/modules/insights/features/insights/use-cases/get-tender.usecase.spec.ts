import { describe, expect, it } from "vitest";

import { GetTenderUseCase } from "#/modules/insights/features/insights/use-cases/get-tender.usecase";

/**
 * One tender by its code, in the shape of the tender list (a list of one).
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe("GetTenderUseCase", () => {
  it("can be constructed", () => {
    const args = [] as unknown as ConstructorParameters<typeof GetTenderUseCase>;
    expect(new GetTenderUseCase(...args)).toBeInstanceOf(GetTenderUseCase);
  });

  it.todo("One tender by its code, in the shape of the tender list (a list of one).");
});
