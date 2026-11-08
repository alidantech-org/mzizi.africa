import { describe, expect, it } from 'vitest';

import { GetSeatAllocationByIdUseCase } from '#/modules/elections/elections-read/use-cases/get-seat-allocation-by-id.usecase';

/**
 * Get party-list and nominated seat allocations by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('GetSeatAllocationByIdUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof GetSeatAllocationByIdUseCase>;
    expect(new GetSeatAllocationByIdUseCase(...args)).toBeInstanceOf(GetSeatAllocationByIdUseCase);
  });

  it.todo("Get party-list and nominated seat allocations by id.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});