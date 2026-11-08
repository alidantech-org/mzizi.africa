import { describe, expect, it } from 'vitest';

import { GetMethodByIdUseCase } from '#/modules/source/source-read/use-cases/get-method-by-id.usecase';

/**
 * Get sourcing methods by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('GetMethodByIdUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof GetMethodByIdUseCase>;
    expect(new GetMethodByIdUseCase(...args)).toBeInstanceOf(GetMethodByIdUseCase);
  });

  it.todo("Get sourcing methods by id.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});