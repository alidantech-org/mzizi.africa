import { describe, expect, it } from 'vitest';

import { FindTransfersUseCase } from '#/modules/finance/finance-read/use-cases/find-transfers.usecase';

/**
 * List transfers.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('FindTransfersUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof FindTransfersUseCase>;
    expect(new FindTransfersUseCase(...args)).toBeInstanceOf(FindTransfersUseCase);
  });

  it.todo("List transfers.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});