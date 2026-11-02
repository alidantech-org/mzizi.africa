import { describe, expect, it } from 'vitest';

import { FindProcurementContractsUseCase } from '#/modules/procurement/procurement-read/use-cases/find-procurement-contracts.usecase';

/**
 * List contracts.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('FindProcurementContractsUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof FindProcurementContractsUseCase>;
    expect(new FindProcurementContractsUseCase(...args)).toBeInstanceOf(FindProcurementContractsUseCase);
  });

  it.todo("List contracts.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});