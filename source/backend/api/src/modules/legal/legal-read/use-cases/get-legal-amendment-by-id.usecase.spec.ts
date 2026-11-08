import { describe, expect, it } from 'vitest';

import { GetLegalAmendmentByIdUseCase } from '#/modules/legal/legal-read/use-cases/get-legal-amendment-by-id.usecase';

/**
 * Get legal amendments by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('GetLegalAmendmentByIdUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof GetLegalAmendmentByIdUseCase>;
    expect(new GetLegalAmendmentByIdUseCase(...args)).toBeInstanceOf(GetLegalAmendmentByIdUseCase);
  });

  it.todo("Get legal amendments by id.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});