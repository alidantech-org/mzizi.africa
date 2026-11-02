import { describe, expect, it } from 'vitest';

import { GetIdeologyByIdUseCase } from '#/modules/political/political-read/use-cases/get-ideology-by-id.usecase';

/**
 * Get ideologies by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('GetIdeologyByIdUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof GetIdeologyByIdUseCase>;
    expect(new GetIdeologyByIdUseCase(...args)).toBeInstanceOf(GetIdeologyByIdUseCase);
  });

  it.todo("Get ideologies by id.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});