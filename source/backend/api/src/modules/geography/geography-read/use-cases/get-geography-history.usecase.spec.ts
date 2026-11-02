import { describe, expect, it } from 'vitest';

import { GetGeographyHistoryUseCase } from '#/modules/geography/geography-read/use-cases/get-geography-history.usecase';

/**
 * Historical names and lineage of an entity.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('GetGeographyHistoryUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof GetGeographyHistoryUseCase>;
    expect(new GetGeographyHistoryUseCase(...args)).toBeInstanceOf(GetGeographyHistoryUseCase);
  });

  it.todo("Historical names and lineage of an entity.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});