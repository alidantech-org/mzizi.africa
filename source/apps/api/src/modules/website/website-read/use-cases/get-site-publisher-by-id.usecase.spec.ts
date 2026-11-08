import { describe, expect, it } from 'vitest';

import { GetSitePublisherByIdUseCase } from '#/modules/website/website-read/use-cases/get-site-publisher-by-id.usecase';

/**
 * Get site and publisher links by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('GetSitePublisherByIdUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof GetSitePublisherByIdUseCase>;
    expect(new GetSitePublisherByIdUseCase(...args)).toBeInstanceOf(GetSitePublisherByIdUseCase);
  });

  it.todo("Get site and publisher links by id.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});