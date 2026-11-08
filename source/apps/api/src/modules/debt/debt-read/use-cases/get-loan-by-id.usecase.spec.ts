import { describe, expect, it } from 'vitest';

import { GetLoanByIdUseCase } from '#/modules/debt/debt-read/use-cases/get-loan-by-id.usecase';

/**
 * Get loans by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('GetLoanByIdUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof GetLoanByIdUseCase>;
    expect(new GetLoanByIdUseCase(...args)).toBeInstanceOf(GetLoanByIdUseCase);
  });

  it.todo("Get loans by id.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});