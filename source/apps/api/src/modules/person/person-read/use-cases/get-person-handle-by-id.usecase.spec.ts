import { describe, expect, it } from 'vitest';

import { GetPersonHandleByIdUseCase } from '#/modules/person/person-read/use-cases/get-person-handle-by-id.usecase';

/**
 * Get public person handles by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('GetPersonHandleByIdUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof GetPersonHandleByIdUseCase>;
    expect(new GetPersonHandleByIdUseCase(...args)).toBeInstanceOf(GetPersonHandleByIdUseCase);
  });

  it.todo("Get public person handles by id.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});