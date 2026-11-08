import { describe, expect, it } from 'vitest';

import { GetLegalProvisionByIdUseCase } from '#/modules/legal/legal-read/use-cases/get-legal-provision-by-id.usecase';

/**
 * Get legal provisions by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('GetLegalProvisionByIdUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof GetLegalProvisionByIdUseCase>;
    expect(new GetLegalProvisionByIdUseCase(...args)).toBeInstanceOf(GetLegalProvisionByIdUseCase);
  });

  it.todo("Get legal provisions by id.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});