import { describe, expect, it } from 'vitest';

import { FindSiteDomainsUseCase } from '#/modules/website/website-read/use-cases/find-site-domains.usecase';

/**
 * List site domains.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('FindSiteDomainsUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof FindSiteDomainsUseCase>;
    expect(new FindSiteDomainsUseCase(...args)).toBeInstanceOf(FindSiteDomainsUseCase);
  });

  it.todo("List site domains.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});