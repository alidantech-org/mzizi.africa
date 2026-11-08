import { describe, expect, it } from 'vitest';

import { GetSiteMemberByIdUseCase } from '#/modules/website/website-read/use-cases/get-site-member-by-id.usecase';

/**
 * Get family memberships by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('GetSiteMemberByIdUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof GetSiteMemberByIdUseCase>;
    expect(new GetSiteMemberByIdUseCase(...args)).toBeInstanceOf(GetSiteMemberByIdUseCase);
  });

  it.todo("Get family memberships by id.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});