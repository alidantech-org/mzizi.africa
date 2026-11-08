import { describe, expect, it } from 'vitest';

import { SearchGeographyUseCase } from '#/modules/geography/geography-read/use-cases/search-geography.usecase';

/**
 * Search administrative entities.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('SearchGeographyUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof SearchGeographyUseCase>;
    expect(new SearchGeographyUseCase(...args)).toBeInstanceOf(SearchGeographyUseCase);
  });

  it.todo("Search administrative entities.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});