import { describe, expect, it } from 'vitest';

import { GetAmenityOfficeByIdUseCase } from '#/modules/services/services-read/use-cases/get-amenity-office-by-id.usecase';

/**
 * Get amenity offices by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('GetAmenityOfficeByIdUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof GetAmenityOfficeByIdUseCase>;
    expect(new GetAmenityOfficeByIdUseCase(...args)).toBeInstanceOf(GetAmenityOfficeByIdUseCase);
  });

  it.todo("Get amenity offices by id.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});