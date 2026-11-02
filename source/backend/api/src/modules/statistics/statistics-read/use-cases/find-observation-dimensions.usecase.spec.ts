import { describe, expect, it } from 'vitest';

import { FindObservationDimensionsUseCase } from '#/modules/statistics/statistics-read/use-cases/find-observation-dimensions.usecase';

/**
 * List observation dimensions.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('FindObservationDimensionsUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof FindObservationDimensionsUseCase>;
    expect(new FindObservationDimensionsUseCase(...args)).toBeInstanceOf(FindObservationDimensionsUseCase);
  });

  it.todo("List observation dimensions.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});