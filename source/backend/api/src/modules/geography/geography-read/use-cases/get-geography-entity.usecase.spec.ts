import { describe, expect, it } from 'vitest';

import { GetGeographyEntityUseCase } from '#/modules/geography/geography-read/use-cases/get-geography-entity.usecase';

/**
 * Resolve a canonical geography id and its metadata.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('GetGeographyEntityUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof GetGeographyEntityUseCase>;
    expect(new GetGeographyEntityUseCase(...args)).toBeInstanceOf(GetGeographyEntityUseCase);
  });

  it.todo("Resolve a canonical geography id and its metadata.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});