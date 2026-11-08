import { describe, expect, it } from 'vitest';

import { FindPersonProfilesUseCase } from '#/modules/person/person-read/use-cases/find-person-profiles.usecase';

/**
 * List person profiles.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('FindPersonProfilesUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof FindPersonProfilesUseCase>;
    expect(new FindPersonProfilesUseCase(...args)).toBeInstanceOf(FindPersonProfilesUseCase);
  });

  it.todo("List person profiles.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});