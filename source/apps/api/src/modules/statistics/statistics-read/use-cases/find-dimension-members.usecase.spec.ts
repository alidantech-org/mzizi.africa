import { describe, expect, it } from 'vitest';

import { FindDimensionMembersUseCase } from '#/modules/statistics/statistics-read/use-cases/find-dimension-members.usecase';

/**
 * List dimension members.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('FindDimensionMembersUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof FindDimensionMembersUseCase>;
    expect(new FindDimensionMembersUseCase(...args)).toBeInstanceOf(FindDimensionMembersUseCase);
  });

  it.todo("List dimension members.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});