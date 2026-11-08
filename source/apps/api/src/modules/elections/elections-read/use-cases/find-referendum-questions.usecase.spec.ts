import { describe, expect, it } from 'vitest';

import { FindReferendumQuestionsUseCase } from '#/modules/elections/elections-read/use-cases/find-referendum-questions.usecase';

/**
 * List referendum questions.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('FindReferendumQuestionsUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof FindReferendumQuestionsUseCase>;
    expect(new FindReferendumQuestionsUseCase(...args)).toBeInstanceOf(FindReferendumQuestionsUseCase);
  });

  it.todo("List referendum questions.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});