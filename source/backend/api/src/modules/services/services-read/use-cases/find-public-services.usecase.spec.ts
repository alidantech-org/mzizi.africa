import { describe, expect, it } from 'vitest';

import { FindPublicServicesUseCase } from '#/modules/services/services-read/use-cases/find-public-services.usecase';

/**
 * List public services.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('FindPublicServicesUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof FindPublicServicesUseCase>;
    expect(new FindPublicServicesUseCase(...args)).toBeInstanceOf(FindPublicServicesUseCase);
  });

  it.todo("List public services.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});