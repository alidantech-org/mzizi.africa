import { describe, expect, it } from 'vitest';

import { GetSiteCheckByIdUseCase } from '#/modules/website/website-read/use-cases/get-site-check-by-id.usecase';

/**
 * Get site checks by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('GetSiteCheckByIdUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof GetSiteCheckByIdUseCase>;
    expect(new GetSiteCheckByIdUseCase(...args)).toBeInstanceOf(GetSiteCheckByIdUseCase);
  });

  it.todo("Get site checks by id.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});