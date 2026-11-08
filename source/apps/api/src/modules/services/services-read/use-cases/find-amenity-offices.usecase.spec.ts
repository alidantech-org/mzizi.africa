import { describe, expect, it } from 'vitest';

import { FindAmenityOfficesUseCase } from '#/modules/services/services-read/use-cases/find-amenity-offices.usecase';

/**
 * List amenity offices.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('FindAmenityOfficesUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof FindAmenityOfficesUseCase>;
    expect(new FindAmenityOfficesUseCase(...args)).toBeInstanceOf(FindAmenityOfficesUseCase);
  });

  it.todo("List amenity offices.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});