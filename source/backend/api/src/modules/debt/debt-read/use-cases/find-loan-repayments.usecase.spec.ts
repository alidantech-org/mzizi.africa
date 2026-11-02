import { describe, expect, it } from 'vitest';

import { FindLoanRepaymentsUseCase } from '#/modules/debt/debt-read/use-cases/find-loan-repayments.usecase';

/**
 * List loan repayments.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('FindLoanRepaymentsUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof FindLoanRepaymentsUseCase>;
    expect(new FindLoanRepaymentsUseCase(...args)).toBeInstanceOf(FindLoanRepaymentsUseCase);
  });

  it.todo("List loan repayments.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});