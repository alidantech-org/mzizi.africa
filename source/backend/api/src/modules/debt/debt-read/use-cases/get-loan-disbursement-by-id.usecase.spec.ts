import { describe, expect, it } from 'vitest';

import { GetLoanDisbursementByIdUseCase } from '#/modules/debt/debt-read/use-cases/get-loan-disbursement-by-id.usecase';

/**
 * Get loan disbursements by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('GetLoanDisbursementByIdUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof GetLoanDisbursementByIdUseCase>;
    expect(new GetLoanDisbursementByIdUseCase(...args)).toBeInstanceOf(GetLoanDisbursementByIdUseCase);
  });

  it.todo("Get loan disbursements by id.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});