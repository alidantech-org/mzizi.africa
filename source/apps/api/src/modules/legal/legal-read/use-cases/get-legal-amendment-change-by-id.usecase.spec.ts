import { describe, expect, it } from 'vitest';

import { GetLegalAmendmentChangeByIdUseCase } from '#/modules/legal/legal-read/use-cases/get-legal-amendment-change-by-id.usecase';

/**
 * Get legal amendment changes by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('GetLegalAmendmentChangeByIdUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof GetLegalAmendmentChangeByIdUseCase>;
    expect(new GetLegalAmendmentChangeByIdUseCase(...args)).toBeInstanceOf(GetLegalAmendmentChangeByIdUseCase);
  });

  it.todo("Get legal amendment changes by id.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});