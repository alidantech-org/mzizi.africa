import { describe, expect, it } from 'vitest';

import { GetPartyPositionByIdUseCase } from '#/modules/political/political-read/use-cases/get-party-position-by-id.usecase';

/**
 * Get party positions by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('GetPartyPositionByIdUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof GetPartyPositionByIdUseCase>;
    expect(new GetPartyPositionByIdUseCase(...args)).toBeInstanceOf(GetPartyPositionByIdUseCase);
  });

  it.todo("Get party positions by id.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});