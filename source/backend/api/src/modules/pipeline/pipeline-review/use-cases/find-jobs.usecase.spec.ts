import { describe, expect, it } from 'vitest';

import { FindJobsUseCase } from '#/modules/pipeline/pipeline-review/use-cases/find-jobs.usecase';

/**
 * List data engine jobs.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('FindJobsUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof FindJobsUseCase>;
    expect(new FindJobsUseCase(...args)).toBeInstanceOf(FindJobsUseCase);
  });

  it.todo("List data engine jobs.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
  it.todo("fails with Unauthorized (401)");
  it.todo("fails with Forbidden (403)");
});