import { describe, expect, it } from 'vitest';

import { FindAmenitiesUseCase } from '#/modules/services/services-read/use-cases/find-amenities.usecase';

/**
 * List amenities.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('FindAmenitiesUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof FindAmenitiesUseCase>;
    expect(new FindAmenitiesUseCase(...args)).toBeInstanceOf(FindAmenitiesUseCase);
  });

  it.todo("List amenities.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});