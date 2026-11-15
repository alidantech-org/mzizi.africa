import { describe, expect, it } from 'vitest';

import { BrowseInstitutionsUseCase } from '#/modules/governance/institutions/use-cases/browse-institutions.usecase';

/**
 * Page through public institutions with their names, optionally by code prefix.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('BrowseInstitutionsUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof BrowseInstitutionsUseCase>;
    expect(new BrowseInstitutionsUseCase(...args)).toBeInstanceOf(BrowseInstitutionsUseCase);
  });

  it.todo("Page through public institutions with their names, optionally by code prefix.");
});