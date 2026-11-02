import { describe, expect, it } from 'vitest';

import { GetLegalEntityByIdUseCase } from '#/modules/entities/entities-read/use-cases/get-legal-entity-by-id.usecase';

/**
 * Get legal entities by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('GetLegalEntityByIdUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof GetLegalEntityByIdUseCase>;
    expect(new GetLegalEntityByIdUseCase(...args)).toBeInstanceOf(GetLegalEntityByIdUseCase);
  });

  it.todo("Get legal entities by id.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});