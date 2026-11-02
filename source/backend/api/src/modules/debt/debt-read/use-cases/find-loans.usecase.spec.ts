import { describe, expect, it } from 'vitest';

import { FindLoansUseCase } from '#/modules/debt/debt-read/use-cases/find-loans.usecase';

/**
 * List loans.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('FindLoansUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof FindLoansUseCase>;
    expect(new FindLoansUseCase(...args)).toBeInstanceOf(FindLoansUseCase);
  });

  it.todo("List loans.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});