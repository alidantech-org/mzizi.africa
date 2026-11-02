import { describe, expect, it } from 'vitest';

import { FindEntityLocationsUseCase } from '#/modules/entities/entities-read/use-cases/find-entity-locations.usecase';

/**
 * List entity locations.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('FindEntityLocationsUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof FindEntityLocationsUseCase>;
    expect(new FindEntityLocationsUseCase(...args)).toBeInstanceOf(FindEntityLocationsUseCase);
  });

  it.todo("List entity locations.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});