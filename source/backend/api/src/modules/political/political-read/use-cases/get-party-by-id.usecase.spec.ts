import { describe, expect, it } from 'vitest';

import { GetPartyByIdUseCase } from '#/modules/political/political-read/use-cases/get-party-by-id.usecase';

/**
 * Get parties by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('GetPartyByIdUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof GetPartyByIdUseCase>;
    expect(new GetPartyByIdUseCase(...args)).toBeInstanceOf(GetPartyByIdUseCase);
  });

  it.todo("Get parties by id.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});