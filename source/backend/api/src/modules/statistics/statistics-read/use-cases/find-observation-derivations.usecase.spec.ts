import { describe, expect, it } from 'vitest';

import { FindObservationDerivationsUseCase } from '#/modules/statistics/statistics-read/use-cases/find-observation-derivations.usecase';

/**
 * List observation derivations.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('FindObservationDerivationsUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof FindObservationDerivationsUseCase>;
    expect(new FindObservationDerivationsUseCase(...args)).toBeInstanceOf(FindObservationDerivationsUseCase);
  });

  it.todo("List observation derivations.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});