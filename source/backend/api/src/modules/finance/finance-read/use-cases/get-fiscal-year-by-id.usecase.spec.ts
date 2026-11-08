import { describe, expect, it } from 'vitest';

import { GetFiscalYearByIdUseCase } from '#/modules/finance/finance-read/use-cases/get-fiscal-year-by-id.usecase';

/**
 * Get fiscal years by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('GetFiscalYearByIdUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof GetFiscalYearByIdUseCase>;
    expect(new GetFiscalYearByIdUseCase(...args)).toBeInstanceOf(GetFiscalYearByIdUseCase);
  });

  it.todo("Get fiscal years by id.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});