import { describe, expect, it } from 'vitest';

import { BrowseUnitsUseCase } from '#/modules/geography/features/places/use-cases/browse-units.usecase';

/**
 * Browse administrative units with their names, optionally for one country or by code prefix.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('BrowseUnitsUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof BrowseUnitsUseCase>;
    expect(new BrowseUnitsUseCase(...args)).toBeInstanceOf(BrowseUnitsUseCase);
  });

  it.todo("Browse administrative units with their names, optionally for one country or by code prefix.");
});