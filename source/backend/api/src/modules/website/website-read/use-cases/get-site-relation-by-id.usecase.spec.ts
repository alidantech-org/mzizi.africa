import { describe, expect, it } from 'vitest';

import { GetSiteRelationByIdUseCase } from '#/modules/website/website-read/use-cases/get-site-relation-by-id.usecase';

/**
 * Get site and family relations by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('GetSiteRelationByIdUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof GetSiteRelationByIdUseCase>;
    expect(new GetSiteRelationByIdUseCase(...args)).toBeInstanceOf(GetSiteRelationByIdUseCase);
  });

  it.todo("Get site and family relations by id.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});