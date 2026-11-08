import { describe, expect, it } from 'vitest';

import { GetPartyUnitByIdUseCase } from '#/modules/political/political-read/use-cases/get-party-unit-by-id.usecase';

/**
 * Get party units by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('GetPartyUnitByIdUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof GetPartyUnitByIdUseCase>;
    expect(new GetPartyUnitByIdUseCase(...args)).toBeInstanceOf(GetPartyUnitByIdUseCase);
  });

  it.todo("Get party units by id.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});