import { describe, expect, it } from 'vitest';

import { GetLoanRepaymentByIdUseCase } from '#/modules/debt/debt-read/use-cases/get-loan-repayment-by-id.usecase';

/**
 * Get loan repayments by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('GetLoanRepaymentByIdUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof GetLoanRepaymentByIdUseCase>;
    expect(new GetLoanRepaymentByIdUseCase(...args)).toBeInstanceOf(GetLoanRepaymentByIdUseCase);
  });

  it.todo("Get loan repayments by id.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});