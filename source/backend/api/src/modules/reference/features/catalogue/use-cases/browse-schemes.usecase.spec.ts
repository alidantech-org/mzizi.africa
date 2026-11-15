import { describe, expect, it } from 'vitest';

import { BrowseSchemesUseCase } from '#/modules/reference/features/catalogue/use-cases/browse-schemes.usecase';

/**
 * Page through classification schemes in code order.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('BrowseSchemesUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof BrowseSchemesUseCase>;
    expect(new BrowseSchemesUseCase(...args)).toBeInstanceOf(BrowseSchemesUseCase);
  });

  it.todo("Page through classification schemes in code order.");
});