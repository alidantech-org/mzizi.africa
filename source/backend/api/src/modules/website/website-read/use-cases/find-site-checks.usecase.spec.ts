import { describe, expect, it } from 'vitest';

import { FindSiteChecksUseCase } from '#/modules/website/website-read/use-cases/find-site-checks.usecase';

/**
 * List site checks.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('FindSiteChecksUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof FindSiteChecksUseCase>;
    expect(new FindSiteChecksUseCase(...args)).toBeInstanceOf(FindSiteChecksUseCase);
  });

  it.todo("List site checks.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});