import { describe, expect, it } from 'vitest';

import { FindMethodsUseCase } from '#/modules/source/source-read/use-cases/find-methods.usecase';

/**
 * List sourcing methods.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('FindMethodsUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof FindMethodsUseCase>;
    expect(new FindMethodsUseCase(...args)).toBeInstanceOf(FindMethodsUseCase);
  });

  it.todo("List sourcing methods.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});