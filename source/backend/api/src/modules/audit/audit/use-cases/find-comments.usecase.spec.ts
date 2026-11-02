import { describe, expect, it } from 'vitest';

import { FindCommentsUseCase } from '#/modules/audit/audit/use-cases/find-comments.usecase';

/**
 * List comments.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('FindCommentsUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof FindCommentsUseCase>;
    expect(new FindCommentsUseCase(...args)).toBeInstanceOf(FindCommentsUseCase);
  });

  it.todo("List comments.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});