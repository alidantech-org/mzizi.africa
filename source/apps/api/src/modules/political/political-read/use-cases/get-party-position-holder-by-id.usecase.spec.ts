import { describe, expect, it } from 'vitest';

import { GetPartyPositionHolderByIdUseCase } from '#/modules/political/political-read/use-cases/get-party-position-holder-by-id.usecase';

/**
 * Get party position holders by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('GetPartyPositionHolderByIdUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof GetPartyPositionHolderByIdUseCase>;
    expect(new GetPartyPositionHolderByIdUseCase(...args)).toBeInstanceOf(GetPartyPositionHolderByIdUseCase);
  });

  it.todo("Get party position holders by id.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});