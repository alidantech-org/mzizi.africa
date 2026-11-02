import { describe, expect, it } from 'vitest';

import { GetPersonNameByIdUseCase } from '#/modules/person/person-read/use-cases/get-person-name-by-id.usecase';

/**
 * Get person names by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('GetPersonNameByIdUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof GetPersonNameByIdUseCase>;
    expect(new GetPersonNameByIdUseCase(...args)).toBeInstanceOf(GetPersonNameByIdUseCase);
  });

  it.todo("Get person names by id.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});