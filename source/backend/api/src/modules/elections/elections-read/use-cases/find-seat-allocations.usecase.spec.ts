import { describe, expect, it } from 'vitest';

import { FindSeatAllocationsUseCase } from '#/modules/elections/elections-read/use-cases/find-seat-allocations.usecase';

/**
 * List party-list and nominated seat allocations.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('FindSeatAllocationsUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof FindSeatAllocationsUseCase>;
    expect(new FindSeatAllocationsUseCase(...args)).toBeInstanceOf(FindSeatAllocationsUseCase);
  });

  it.todo("List party-list and nominated seat allocations.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});