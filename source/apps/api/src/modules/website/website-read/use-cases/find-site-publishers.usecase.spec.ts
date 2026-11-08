import { describe, expect, it } from 'vitest';

import { FindSitePublishersUseCase } from '#/modules/website/website-read/use-cases/find-site-publishers.usecase';

/**
 * List site and publisher links.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('FindSitePublishersUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof FindSitePublishersUseCase>;
    expect(new FindSitePublishersUseCase(...args)).toBeInstanceOf(FindSitePublishersUseCase);
  });

  it.todo("List site and publisher links.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});