import { describe, expect, it } from 'vitest';

import { FindLegalEntitiesUseCase } from '#/modules/entities/entities-read/use-cases/find-legal-entities.usecase';

/**
 * List legal entities.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('FindLegalEntitiesUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof FindLegalEntitiesUseCase>;
    expect(new FindLegalEntitiesUseCase(...args)).toBeInstanceOf(FindLegalEntitiesUseCase);
  });

  it.todo("List legal entities.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});