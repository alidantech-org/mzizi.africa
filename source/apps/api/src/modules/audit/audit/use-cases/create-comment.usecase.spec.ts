import { describe, expect, it } from 'vitest';

import { CreateCommentUseCase } from '#/modules/audit/audit/use-cases/create-comment.usecase';

/**
 * Add a comment to a record.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('CreateCommentUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof CreateCommentUseCase>;
    expect(new CreateCommentUseCase(...args)).toBeInstanceOf(CreateCommentUseCase);
  });

  it.todo("Add a comment to a record.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
  it.todo("fails with Unauthorized (401)");
  it.todo("fails with Forbidden (403)");
});