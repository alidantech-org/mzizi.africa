import { describe, expect, it } from 'vitest';

import { GetPersonProfileByIdUseCase } from '#/modules/person/person-read/use-cases/get-person-profile-by-id.usecase';

/**
 * Get person profiles by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('GetPersonProfileByIdUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof GetPersonProfileByIdUseCase>;
    expect(new GetPersonProfileByIdUseCase(...args)).toBeInstanceOf(GetPersonProfileByIdUseCase);
  });

  it.todo("Get person profiles by id.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});