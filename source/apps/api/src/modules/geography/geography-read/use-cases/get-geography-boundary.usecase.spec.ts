import { describe, expect, it } from 'vitest';

import { GetGeographyBoundaryUseCase } from '#/modules/geography/geography-read/use-cases/get-geography-boundary.usecase';

/**
 * Return the verified geometry for an entity.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('GetGeographyBoundaryUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof GetGeographyBoundaryUseCase>;
    expect(new GetGeographyBoundaryUseCase(...args)).toBeInstanceOf(GetGeographyBoundaryUseCase);
  });

  it.todo("Return the verified geometry for an entity.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});