import { describe, expect, it } from 'vitest';

import { GetAmenityByIdUseCase } from '#/modules/services/services-read/use-cases/get-amenity-by-id.usecase';

/**
 * Get amenities by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('GetAmenityByIdUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof GetAmenityByIdUseCase>;
    expect(new GetAmenityByIdUseCase(...args)).toBeInstanceOf(GetAmenityByIdUseCase);
  });

  it.todo("Get amenities by id.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});