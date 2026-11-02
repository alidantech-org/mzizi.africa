import { describe, expect, it } from 'vitest';

import { FindPersonNamesUseCase } from '#/modules/person/person-read/use-cases/find-person-names.usecase';

/**
 * List person names.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('FindPersonNamesUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof FindPersonNamesUseCase>;
    expect(new FindPersonNamesUseCase(...args)).toBeInstanceOf(FindPersonNamesUseCase);
  });

  it.todo("List person names.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});