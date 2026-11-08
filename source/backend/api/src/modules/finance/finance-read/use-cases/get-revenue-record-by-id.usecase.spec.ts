import { describe, expect, it } from 'vitest';

import { GetRevenueRecordByIdUseCase } from '#/modules/finance/finance-read/use-cases/get-revenue-record-by-id.usecase';

/**
 * Get revenue records by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('GetRevenueRecordByIdUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof GetRevenueRecordByIdUseCase>;
    expect(new GetRevenueRecordByIdUseCase(...args)).toBeInstanceOf(GetRevenueRecordByIdUseCase);
  });

  it.todo("Get revenue records by id.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});