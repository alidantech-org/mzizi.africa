import { describe, expect, it } from 'vitest';

import { GetIndicatorColumnByIdUseCase } from '#/modules/statistics/statistics-read/use-cases/get-indicator-column-by-id.usecase';

/**
 * Get indicator columns by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('GetIndicatorColumnByIdUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof GetIndicatorColumnByIdUseCase>;
    expect(new GetIndicatorColumnByIdUseCase(...args)).toBeInstanceOf(GetIndicatorColumnByIdUseCase);
  });

  it.todo("Get indicator columns by id.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});