import { describe, expect, it } from 'vitest';

import { GetTenderByIdUseCase } from '#/modules/procurement/procurement-read/use-cases/get-tender-by-id.usecase';

/**
 * Get tenders by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('GetTenderByIdUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof GetTenderByIdUseCase>;
    expect(new GetTenderByIdUseCase(...args)).toBeInstanceOf(GetTenderByIdUseCase);
  });

  it.todo("Get tenders by id.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});