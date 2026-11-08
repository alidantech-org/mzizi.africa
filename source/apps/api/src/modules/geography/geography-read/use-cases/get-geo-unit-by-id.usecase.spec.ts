import { describe, expect, it } from 'vitest';

import { GetGeoUnitByIdUseCase } from '#/modules/geography/geography-read/use-cases/get-geo-unit-by-id.usecase';

/**
 * Get a geography unit record with its evidence fields.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('GetGeoUnitByIdUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof GetGeoUnitByIdUseCase>;
    expect(new GetGeoUnitByIdUseCase(...args)).toBeInstanceOf(GetGeoUnitByIdUseCase);
  });

  it.todo("Get a geography unit record with its evidence fields.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});