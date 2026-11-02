import { describe, expect, it } from 'vitest';

import { GetTransferByIdUseCase } from '#/modules/finance/finance-read/use-cases/get-transfer-by-id.usecase';

/**
 * Get transfers by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('GetTransferByIdUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof GetTransferByIdUseCase>;
    expect(new GetTransferByIdUseCase(...args)).toBeInstanceOf(GetTransferByIdUseCase);
  });

  it.todo("Get transfers by id.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});