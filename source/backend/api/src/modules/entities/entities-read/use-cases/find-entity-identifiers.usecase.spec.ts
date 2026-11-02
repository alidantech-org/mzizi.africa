import { describe, expect, it } from 'vitest';

import { FindEntityIdentifiersUseCase } from '#/modules/entities/entities-read/use-cases/find-entity-identifiers.usecase';

/**
 * List entity identifiers.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('FindEntityIdentifiersUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof FindEntityIdentifiersUseCase>;
    expect(new FindEntityIdentifiersUseCase(...args)).toBeInstanceOf(FindEntityIdentifiersUseCase);
  });

  it.todo("List entity identifiers.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});