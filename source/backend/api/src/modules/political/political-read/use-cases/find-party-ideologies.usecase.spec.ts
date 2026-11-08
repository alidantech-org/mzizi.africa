import { describe, expect, it } from 'vitest';

import { FindPartyIdeologiesUseCase } from '#/modules/political/political-read/use-cases/find-party-ideologies.usecase';

/**
 * List party ideologies.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('FindPartyIdeologiesUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof FindPartyIdeologiesUseCase>;
    expect(new FindPartyIdeologiesUseCase(...args)).toBeInstanceOf(FindPartyIdeologiesUseCase);
  });

  it.todo("List party ideologies.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});