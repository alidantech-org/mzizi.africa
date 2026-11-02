import { describe, expect, it } from 'vitest';

import { FindPartyPositionsUseCase } from '#/modules/political/political-read/use-cases/find-party-positions.usecase';

/**
 * List party positions.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('FindPartyPositionsUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof FindPartyPositionsUseCase>;
    expect(new FindPartyPositionsUseCase(...args)).toBeInstanceOf(FindPartyPositionsUseCase);
  });

  it.todo("List party positions.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});