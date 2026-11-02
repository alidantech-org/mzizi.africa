import { describe, expect, it } from 'vitest';

import { FindPeopleUseCase } from '#/modules/governance/governance-read/use-cases/find-people.usecase';

/**
 * List people.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('FindPeopleUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof FindPeopleUseCase>;
    expect(new FindPeopleUseCase(...args)).toBeInstanceOf(FindPeopleUseCase);
  });

  it.todo("List people.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});