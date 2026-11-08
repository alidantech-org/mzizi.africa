import { describe, expect, it } from 'vitest';

import { FindStatisticsTablesUseCase } from '#/modules/statistics/statistics-read/use-cases/find-statistics-tables.usecase';

/**
 * List statistics tables.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('FindStatisticsTablesUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof FindStatisticsTablesUseCase>;
    expect(new FindStatisticsTablesUseCase(...args)).toBeInstanceOf(FindStatisticsTablesUseCase);
  });

  it.todo("List statistics tables.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});