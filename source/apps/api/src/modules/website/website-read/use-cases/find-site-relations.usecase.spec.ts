import { describe, expect, it } from 'vitest';

import { FindSiteRelationsUseCase } from '#/modules/website/website-read/use-cases/find-site-relations.usecase';

/**
 * List site and family relations.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('FindSiteRelationsUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof FindSiteRelationsUseCase>;
    expect(new FindSiteRelationsUseCase(...args)).toBeInstanceOf(FindSiteRelationsUseCase);
  });

  it.todo("List site and family relations.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});