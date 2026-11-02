import { describe, expect, it } from 'vitest';

import { GetDimensionMemberByIdUseCase } from '#/modules/statistics/statistics-read/use-cases/get-dimension-member-by-id.usecase';

/**
 * Get dimension members by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('GetDimensionMemberByIdUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof GetDimensionMemberByIdUseCase>;
    expect(new GetDimensionMemberByIdUseCase(...args)).toBeInstanceOf(GetDimensionMemberByIdUseCase);
  });

  it.todo("Get dimension members by id.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});