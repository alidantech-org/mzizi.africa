import { describe, expect, it } from 'vitest';

import { GetCandidateDetailUseCase } from '#/modules/pipeline/pipeline-review/use-cases/get-candidate-detail.usecase';

/**
 * Get a staged candidate with payload, issues, lineage and the current canonical record.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('GetCandidateDetailUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof GetCandidateDetailUseCase>;
    expect(new GetCandidateDetailUseCase(...args)).toBeInstanceOf(GetCandidateDetailUseCase);
  });

  it.todo("Get a staged candidate with payload, issues, lineage and the current canonical record.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
  it.todo("fails with Unauthorized (401)");
  it.todo("fails with Forbidden (403)");
});