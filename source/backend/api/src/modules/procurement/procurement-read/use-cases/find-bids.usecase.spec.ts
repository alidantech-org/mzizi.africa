import { describe, expect, it } from 'vitest';

import { FindBidsUseCase } from '#/modules/procurement/procurement-read/use-cases/find-bids.usecase';

/**
 * List bids.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('FindBidsUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof FindBidsUseCase>;
    expect(new FindBidsUseCase(...args)).toBeInstanceOf(FindBidsUseCase);
  });

  it.todo("List bids.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});