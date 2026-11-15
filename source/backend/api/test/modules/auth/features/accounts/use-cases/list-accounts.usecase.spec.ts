import { describe, expect, it } from "vitest";

import { ListAccountsUseCase } from "#/modules/auth/features/accounts/use-cases/list-accounts.usecase";

/**
 * Page through accounts, optionally by status. Administrators only.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe("ListAccountsUseCase", () => {
  it("can be constructed", () => {
    const args = [] as unknown as ConstructorParameters<typeof ListAccountsUseCase>;
    expect(new ListAccountsUseCase(...args)).toBeInstanceOf(ListAccountsUseCase);
  });

  it.todo("Page through accounts, optionally by status. Administrators only.");
});
