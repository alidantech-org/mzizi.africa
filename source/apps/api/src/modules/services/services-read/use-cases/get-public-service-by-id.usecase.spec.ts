import { describe, expect, it } from 'vitest';

import { GetPublicServiceByIdUseCase } from '#/modules/services/services-read/use-cases/get-public-service-by-id.usecase';

/**
 * Get public services by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('GetPublicServiceByIdUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof GetPublicServiceByIdUseCase>;
    expect(new GetPublicServiceByIdUseCase(...args)).toBeInstanceOf(GetPublicServiceByIdUseCase);
  });

  it.todo("Get public services by id.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});