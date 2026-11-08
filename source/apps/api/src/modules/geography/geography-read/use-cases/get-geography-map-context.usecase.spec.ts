import { describe, expect, it } from 'vitest';

import { GetGeographyMapContextUseCase } from '#/modules/geography/geography-read/use-cases/get-geography-map-context.usecase';

/**
 * Parent outline and sibling boundaries for map context.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('GetGeographyMapContextUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof GetGeographyMapContextUseCase>;
    expect(new GetGeographyMapContextUseCase(...args)).toBeInstanceOf(GetGeographyMapContextUseCase);
  });

  it.todo("Parent outline and sibling boundaries for map context.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});