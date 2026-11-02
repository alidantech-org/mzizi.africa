import { describe, expect, it } from 'vitest';

import { GetEntityOwnershipByIdUseCase } from '#/modules/entities/entities-read/use-cases/get-entity-ownership-by-id.usecase';

/**
 * Get entity ownerships by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('GetEntityOwnershipByIdUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof GetEntityOwnershipByIdUseCase>;
    expect(new GetEntityOwnershipByIdUseCase(...args)).toBeInstanceOf(GetEntityOwnershipByIdUseCase);
  });

  it.todo("Get entity ownerships by id.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});