import { describe, expect, it } from 'vitest';

import { GetCommentByIdUseCase } from '#/modules/audit/audit/use-cases/get-comment-by-id.usecase';

/**
 * Get comments by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('GetCommentByIdUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof GetCommentByIdUseCase>;
    expect(new GetCommentByIdUseCase(...args)).toBeInstanceOf(GetCommentByIdUseCase);
  });

  it.todo("Get comments by id.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});