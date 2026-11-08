import { describe, expect, it } from 'vitest';

import { FindFiscalYearsUseCase } from '#/modules/finance/finance-read/use-cases/find-fiscal-years.usecase';

/**
 * List fiscal years.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('FindFiscalYearsUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof FindFiscalYearsUseCase>;
    expect(new FindFiscalYearsUseCase(...args)).toBeInstanceOf(FindFiscalYearsUseCase);
  });

  it.todo("List fiscal years.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});