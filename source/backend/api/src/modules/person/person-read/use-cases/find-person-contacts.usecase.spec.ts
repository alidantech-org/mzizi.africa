import { describe, expect, it } from 'vitest';

import { FindPersonContactsUseCase } from '#/modules/person/person-read/use-cases/find-person-contacts.usecase';

/**
 * List public person contacts.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('FindPersonContactsUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof FindPersonContactsUseCase>;
    expect(new FindPersonContactsUseCase(...args)).toBeInstanceOf(FindPersonContactsUseCase);
  });

  it.todo("List public person contacts.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});