import { describe, expect, it } from 'vitest';

import { FindPartyMembershipsUseCase } from '#/modules/political/political-read/use-cases/find-party-memberships.usecase';

/**
 * List party memberships.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('FindPartyMembershipsUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof FindPartyMembershipsUseCase>;
    expect(new FindPartyMembershipsUseCase(...args)).toBeInstanceOf(FindPartyMembershipsUseCase);
  });

  it.todo("List party memberships.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});