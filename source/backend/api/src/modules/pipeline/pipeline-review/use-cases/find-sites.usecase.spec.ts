import { describe, expect, it } from 'vitest';

import { FindSitesUseCase } from '#/modules/pipeline/pipeline-review/use-cases/find-sites.usecase';

/**
 * List registered sites.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('FindSitesUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof FindSitesUseCase>;
    expect(new FindSitesUseCase(...args)).toBeInstanceOf(FindSitesUseCase);
  });

  it.todo("List registered sites.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
  it.todo("fails with Unauthorized (401)");
  it.todo("fails with Forbidden (403)");
});