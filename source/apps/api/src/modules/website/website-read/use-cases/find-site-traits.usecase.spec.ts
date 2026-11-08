import { describe, expect, it } from 'vitest';

import { FindSiteTraitsUseCase } from '#/modules/website/website-read/use-cases/find-site-traits.usecase';

/**
 * List site and family traits.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('FindSiteTraitsUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof FindSiteTraitsUseCase>;
    expect(new FindSiteTraitsUseCase(...args)).toBeInstanceOf(FindSiteTraitsUseCase);
  });

  it.todo("List site and family traits.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});