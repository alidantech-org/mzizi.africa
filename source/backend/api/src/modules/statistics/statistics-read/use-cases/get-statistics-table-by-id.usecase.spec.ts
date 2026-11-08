import { describe, expect, it } from 'vitest';

import { GetStatisticsTableByIdUseCase } from '#/modules/statistics/statistics-read/use-cases/get-statistics-table-by-id.usecase';

/**
 * Get statistics tables by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('GetStatisticsTableByIdUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof GetStatisticsTableByIdUseCase>;
    expect(new GetStatisticsTableByIdUseCase(...args)).toBeInstanceOf(GetStatisticsTableByIdUseCase);
  });

  it.todo("Get statistics tables by id.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});