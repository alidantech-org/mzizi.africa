import { describe, expect, it } from 'vitest';

import { FindAssessmentsUseCase } from '#/modules/pipeline/pipeline-review/use-cases/find-assessments.usecase';

/**
 * List site legal and source assessments.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('FindAssessmentsUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof FindAssessmentsUseCase>;
    expect(new FindAssessmentsUseCase(...args)).toBeInstanceOf(FindAssessmentsUseCase);
  });

  it.todo("List site legal and source assessments.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
  it.todo("fails with Unauthorized (401)");
  it.todo("fails with Forbidden (403)");
});