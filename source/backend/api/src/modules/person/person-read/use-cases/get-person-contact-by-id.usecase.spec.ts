import { describe, expect, it } from 'vitest';

import { GetPersonContactByIdUseCase } from '#/modules/person/person-read/use-cases/get-person-contact-by-id.usecase';

/**
 * Get public person contacts by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('GetPersonContactByIdUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof GetPersonContactByIdUseCase>;
    expect(new GetPersonContactByIdUseCase(...args)).toBeInstanceOf(GetPersonContactByIdUseCase);
  });

  it.todo("Get public person contacts by id.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});