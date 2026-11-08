import { describe, expect, it } from 'vitest';

import { FindEntityOwnershipsUseCase } from '#/modules/entities/entities-read/use-cases/find-entity-ownerships.usecase';

/**
 * List entity ownerships.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('FindEntityOwnershipsUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof FindEntityOwnershipsUseCase>;
    expect(new FindEntityOwnershipsUseCase(...args)).toBeInstanceOf(FindEntityOwnershipsUseCase);
  });

  it.todo("List entity ownerships.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});