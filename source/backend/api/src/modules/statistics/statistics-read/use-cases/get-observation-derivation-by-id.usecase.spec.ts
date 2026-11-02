import { describe, expect, it } from 'vitest';

import { GetObservationDerivationByIdUseCase } from '#/modules/statistics/statistics-read/use-cases/get-observation-derivation-by-id.usecase';

/**
 * Get observation derivations by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('GetObservationDerivationByIdUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof GetObservationDerivationByIdUseCase>;
    expect(new GetObservationDerivationByIdUseCase(...args)).toBeInstanceOf(GetObservationDerivationByIdUseCase);
  });

  it.todo("Get observation derivations by id.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});