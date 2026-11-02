import { describe, expect, it } from 'vitest';

import { GetPersonByIdUseCase } from '#/modules/governance/governance-read/use-cases/get-person-by-id.usecase';

/**
 * Get people by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('GetPersonByIdUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof GetPersonByIdUseCase>;
    expect(new GetPersonByIdUseCase(...args)).toBeInstanceOf(GetPersonByIdUseCase);
  });

  it.todo("Get people by id.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});