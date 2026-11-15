import { describe, expect, it } from 'vitest';

import { LookupMemberUseCase } from '#/modules/reference/features/catalogue/use-cases/lookup-member.usecase';

/**
 * Find one classification member from its code (codes are unique across every scheme).
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('LookupMemberUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof LookupMemberUseCase>;
    expect(new LookupMemberUseCase(...args)).toBeInstanceOf(LookupMemberUseCase);
  });

  it.todo("Find one classification member from its code (codes are unique across every scheme).");
  it.todo("fails with Not Found (404)");
});