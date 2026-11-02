import { describe, expect, it } from 'vitest';

import { GetSiteFamilyByIdUseCase } from '#/modules/website/website-read/use-cases/get-site-family-by-id.usecase';

/**
 * Get site families by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('GetSiteFamilyByIdUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof GetSiteFamilyByIdUseCase>;
    expect(new GetSiteFamilyByIdUseCase(...args)).toBeInstanceOf(GetSiteFamilyByIdUseCase);
  });

  it.todo("Get site families by id.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});