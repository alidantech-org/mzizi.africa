import { describe, expect, it } from 'vitest';

import { GetMyAccountUseCase } from '#/modules/auth/features/accounts/use-cases/get-my-account.usecase';

/**
 * The signed-in person's own account.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('GetMyAccountUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof GetMyAccountUseCase>;
    expect(new GetMyAccountUseCase(...args)).toBeInstanceOf(GetMyAccountUseCase);
  });

  it.todo("The signed-in person\u0027s own account.");
  it.todo("fails with Not Found (404)");
});