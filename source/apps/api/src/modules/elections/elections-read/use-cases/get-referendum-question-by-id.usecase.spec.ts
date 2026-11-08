import { describe, expect, it } from 'vitest';

import { GetReferendumQuestionByIdUseCase } from '#/modules/elections/elections-read/use-cases/get-referendum-question-by-id.usecase';

/**
 * Get referendum questions by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('GetReferendumQuestionByIdUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof GetReferendumQuestionByIdUseCase>;
    expect(new GetReferendumQuestionByIdUseCase(...args)).toBeInstanceOf(GetReferendumQuestionByIdUseCase);
  });

  it.todo("Get referendum questions by id.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});