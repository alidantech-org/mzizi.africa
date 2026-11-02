import { describe, expect, it } from 'vitest';

import { FindIndicatorColumnsUseCase } from '#/modules/statistics/statistics-read/use-cases/find-indicator-columns.usecase';

/**
 * List indicator columns.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('FindIndicatorColumnsUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof FindIndicatorColumnsUseCase>;
    expect(new FindIndicatorColumnsUseCase(...args)).toBeInstanceOf(FindIndicatorColumnsUseCase);
  });

  it.todo("List indicator columns.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});