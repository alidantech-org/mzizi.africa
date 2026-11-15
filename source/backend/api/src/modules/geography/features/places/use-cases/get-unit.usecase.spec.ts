import { describe, expect, it } from 'vitest';

import { GetUnitUseCase } from '#/modules/geography/features/places/use-cases/get-unit.usecase';

/**
 * One administrative unit with its names.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('GetUnitUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof GetUnitUseCase>;
    expect(new GetUnitUseCase(...args)).toBeInstanceOf(GetUnitUseCase);
  });

  it.todo("One administrative unit with its names.");
  it.todo("fails with Not Found (404)");
});