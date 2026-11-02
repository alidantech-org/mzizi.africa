import { describe, expect, it } from 'vitest';

import { FindPartyPositionHoldersUseCase } from '#/modules/political/political-read/use-cases/find-party-position-holders.usecase';

/**
 * List party position holders.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('FindPartyPositionHoldersUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof FindPartyPositionHoldersUseCase>;
    expect(new FindPartyPositionHoldersUseCase(...args)).toBeInstanceOf(FindPartyPositionHoldersUseCase);
  });

  it.todo("List party position holders.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});