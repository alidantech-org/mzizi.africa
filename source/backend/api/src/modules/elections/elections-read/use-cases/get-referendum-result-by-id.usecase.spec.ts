import { describe, expect, it } from 'vitest';

import { GetReferendumResultByIdUseCase } from '#/modules/elections/elections-read/use-cases/get-referendum-result-by-id.usecase';

/**
 * Get referendum results by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('GetReferendumResultByIdUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof GetReferendumResultByIdUseCase>;
    expect(new GetReferendumResultByIdUseCase(...args)).toBeInstanceOf(GetReferendumResultByIdUseCase);
  });

  it.todo("Get referendum results by id.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});