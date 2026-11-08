import { describe, expect, it } from 'vitest';

import { FindContractVariationsUseCase } from '#/modules/procurement/procurement-read/use-cases/find-contract-variations.usecase';

/**
 * List contract variations.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('FindContractVariationsUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof FindContractVariationsUseCase>;
    expect(new FindContractVariationsUseCase(...args)).toBeInstanceOf(FindContractVariationsUseCase);
  });

  it.todo("List contract variations.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});