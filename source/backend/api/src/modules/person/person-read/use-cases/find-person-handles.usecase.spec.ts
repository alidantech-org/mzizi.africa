import { describe, expect, it } from 'vitest';

import { FindPersonHandlesUseCase } from '#/modules/person/person-read/use-cases/find-person-handles.usecase';

/**
 * List public person handles.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('FindPersonHandlesUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof FindPersonHandlesUseCase>;
    expect(new FindPersonHandlesUseCase(...args)).toBeInstanceOf(FindPersonHandlesUseCase);
  });

  it.todo("List public person handles.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});