import { describe, expect, it } from 'vitest';

import { GetEntityIdentifierByIdUseCase } from '#/modules/entities/entities-read/use-cases/get-entity-identifier-by-id.usecase';

/**
 * Get entity identifiers by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('GetEntityIdentifierByIdUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof GetEntityIdentifierByIdUseCase>;
    expect(new GetEntityIdentifierByIdUseCase(...args)).toBeInstanceOf(GetEntityIdentifierByIdUseCase);
  });

  it.todo("Get entity identifiers by id.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});