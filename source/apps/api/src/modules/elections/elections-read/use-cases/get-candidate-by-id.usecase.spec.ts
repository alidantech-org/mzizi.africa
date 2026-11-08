import { describe, expect, it } from 'vitest';

import { GetCandidateByIdUseCase } from '#/modules/elections/elections-read/use-cases/get-candidate-by-id.usecase';

/**
 * Get candidates by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('GetCandidateByIdUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof GetCandidateByIdUseCase>;
    expect(new GetCandidateByIdUseCase(...args)).toBeInstanceOf(GetCandidateByIdUseCase);
  });

  it.todo("Get candidates by id.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});