import { describe, expect, it } from 'vitest';

import { FindIndicatorsUseCase } from '#/modules/statistics/statistics-read/use-cases/find-indicators.usecase';

/**
 * List indicators.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('FindIndicatorsUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof FindIndicatorsUseCase>;
    expect(new FindIndicatorsUseCase(...args)).toBeInstanceOf(FindIndicatorsUseCase);
  });

  it.todo("List indicators.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});