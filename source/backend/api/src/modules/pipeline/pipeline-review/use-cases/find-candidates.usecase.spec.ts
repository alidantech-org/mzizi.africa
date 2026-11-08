import { describe, expect, it } from 'vitest';

import { FindCandidatesUseCase } from '#/modules/pipeline/pipeline-review/use-cases/find-candidates.usecase';

/**
 * List staged candidates.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('FindCandidatesUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof FindCandidatesUseCase>;
    expect(new FindCandidatesUseCase(...args)).toBeInstanceOf(FindCandidatesUseCase);
  });

  it.todo("List staged candidates.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
  it.todo("fails with Unauthorized (401)");
  it.todo("fails with Forbidden (403)");
});