import { describe, expect, it } from 'vitest';

import { GetPartyIdeologyByIdUseCase } from '#/modules/political/political-read/use-cases/get-party-ideology-by-id.usecase';

/**
 * Get party ideologies by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('GetPartyIdeologyByIdUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof GetPartyIdeologyByIdUseCase>;
    expect(new GetPartyIdeologyByIdUseCase(...args)).toBeInstanceOf(GetPartyIdeologyByIdUseCase);
  });

  it.todo("Get party ideologies by id.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});