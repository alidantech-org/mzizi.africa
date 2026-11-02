import { describe, expect, it } from 'vitest';

import { GetChildBoundariesUseCase } from '#/modules/geography/geography-read/use-cases/get-child-boundaries.usecase';

/**
 * Return the immediate child boundaries as GeoJSON.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('GetChildBoundariesUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof GetChildBoundariesUseCase>;
    expect(new GetChildBoundariesUseCase(...args)).toBeInstanceOf(GetChildBoundariesUseCase);
  });

  it.todo("Return the immediate child boundaries as GeoJSON.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});