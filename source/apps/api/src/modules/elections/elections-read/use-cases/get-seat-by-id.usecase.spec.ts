import { describe, expect, it } from 'vitest';

import { GetSeatByIdUseCase } from '#/modules/elections/elections-read/use-cases/get-seat-by-id.usecase';

/**
 * Get seats by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('GetSeatByIdUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof GetSeatByIdUseCase>;
    expect(new GetSeatByIdUseCase(...args)).toBeInstanceOf(GetSeatByIdUseCase);
  });

  it.todo("Get seats by id.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});