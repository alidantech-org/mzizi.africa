import { describe, expect, it } from 'vitest';

import { FindRevenueRecordsUseCase } from '#/modules/finance/finance-read/use-cases/find-revenue-records.usecase';

/**
 * List revenue records.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('FindRevenueRecordsUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof FindRevenueRecordsUseCase>;
    expect(new FindRevenueRecordsUseCase(...args)).toBeInstanceOf(FindRevenueRecordsUseCase);
  });

  it.todo("List revenue records.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});