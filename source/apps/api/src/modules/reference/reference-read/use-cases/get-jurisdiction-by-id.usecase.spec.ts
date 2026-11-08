import { describe, expect, it } from 'vitest';

import { GetJurisdictionByIdUseCase } from '#/modules/reference/reference-read/use-cases/get-jurisdiction-by-id.usecase';

/**
 * Get jurisdictions by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('GetJurisdictionByIdUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof GetJurisdictionByIdUseCase>;
    expect(new GetJurisdictionByIdUseCase(...args)).toBeInstanceOf(GetJurisdictionByIdUseCase);
  });

  it.todo("Get jurisdictions by id.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});