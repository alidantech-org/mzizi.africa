import { describe, expect, it } from 'vitest';

import { FindIndicatorCategoriesUseCase } from '#/modules/statistics/statistics-read/use-cases/find-indicator-categories.usecase';

/**
 * List indicator categories.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('FindIndicatorCategoriesUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof FindIndicatorCategoriesUseCase>;
    expect(new FindIndicatorCategoriesUseCase(...args)).toBeInstanceOf(FindIndicatorCategoriesUseCase);
  });

  it.todo("List indicator categories.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});