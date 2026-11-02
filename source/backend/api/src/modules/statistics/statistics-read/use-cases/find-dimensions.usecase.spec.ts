import { describe, expect, it } from 'vitest';

import { FindDimensionsUseCase } from '#/modules/statistics/statistics-read/use-cases/find-dimensions.usecase';

/**
 * List dimensions.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('FindDimensionsUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof FindDimensionsUseCase>;
    expect(new FindDimensionsUseCase(...args)).toBeInstanceOf(FindDimensionsUseCase);
  });

  it.todo("List dimensions.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});