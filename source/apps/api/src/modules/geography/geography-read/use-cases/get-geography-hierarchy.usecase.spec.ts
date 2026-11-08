import { describe, expect, it } from 'vitest';

import { GetGeographyHierarchyUseCase } from '#/modules/geography/geography-read/use-cases/get-geography-hierarchy.usecase';

/**
 * Ancestors and children of an entity.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('GetGeographyHierarchyUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof GetGeographyHierarchyUseCase>;
    expect(new GetGeographyHierarchyUseCase(...args)).toBeInstanceOf(GetGeographyHierarchyUseCase);
  });

  it.todo("Ancestors and children of an entity.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});