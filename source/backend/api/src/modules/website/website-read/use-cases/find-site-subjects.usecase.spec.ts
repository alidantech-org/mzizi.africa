import { describe, expect, it } from 'vitest';

import { FindSiteSubjectsUseCase } from '#/modules/website/website-read/use-cases/find-site-subjects.usecase';

/**
 * List site subjects.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('FindSiteSubjectsUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof FindSiteSubjectsUseCase>;
    expect(new FindSiteSubjectsUseCase(...args)).toBeInstanceOf(FindSiteSubjectsUseCase);
  });

  it.todo("List site subjects.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});