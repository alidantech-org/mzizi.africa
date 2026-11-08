import { describe, expect, it } from 'vitest';

import { GetSiteTraitByIdUseCase } from '#/modules/website/website-read/use-cases/get-site-trait-by-id.usecase';

/**
 * Get site and family traits by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('GetSiteTraitByIdUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof GetSiteTraitByIdUseCase>;
    expect(new GetSiteTraitByIdUseCase(...args)).toBeInstanceOf(GetSiteTraitByIdUseCase);
  });

  it.todo("Get site and family traits by id.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});