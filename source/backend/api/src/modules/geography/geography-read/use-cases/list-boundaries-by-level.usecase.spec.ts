import { describe, expect, it } from 'vitest';

import { ListBoundariesByLevelUseCase } from '#/modules/geography/geography-read/use-cases/list-boundaries-by-level.usecase';

/**
 * Verified outlines of every unit at a level within a country.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('ListBoundariesByLevelUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof ListBoundariesByLevelUseCase>;
    expect(new ListBoundariesByLevelUseCase(...args)).toBeInstanceOf(ListBoundariesByLevelUseCase);
  });

  it.todo("Verified outlines of every unit at a level within a country.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});