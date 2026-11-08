import { describe, expect, it } from 'vitest';

import { GetContractVariationByIdUseCase } from '#/modules/procurement/procurement-read/use-cases/get-contract-variation-by-id.usecase';

/**
 * Get contract variations by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('GetContractVariationByIdUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof GetContractVariationByIdUseCase>;
    expect(new GetContractVariationByIdUseCase(...args)).toBeInstanceOf(GetContractVariationByIdUseCase);
  });

  it.todo("Get contract variations by id.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});