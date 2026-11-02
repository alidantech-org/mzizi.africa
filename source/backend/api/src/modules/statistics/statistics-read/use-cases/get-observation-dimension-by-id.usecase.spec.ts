import { describe, expect, it } from 'vitest';

import { GetObservationDimensionByIdUseCase } from '#/modules/statistics/statistics-read/use-cases/get-observation-dimension-by-id.usecase';

/**
 * Get observation dimensions by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('GetObservationDimensionByIdUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof GetObservationDimensionByIdUseCase>;
    expect(new GetObservationDimensionByIdUseCase(...args)).toBeInstanceOf(GetObservationDimensionByIdUseCase);
  });

  it.todo("Get observation dimensions by id.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});