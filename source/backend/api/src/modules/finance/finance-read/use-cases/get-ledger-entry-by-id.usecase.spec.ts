import { describe, expect, it } from 'vitest';

import { GetLedgerEntryByIdUseCase } from '#/modules/finance/finance-read/use-cases/get-ledger-entry-by-id.usecase';

/**
 * Get ledger entries by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('GetLedgerEntryByIdUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof GetLedgerEntryByIdUseCase>;
    expect(new GetLedgerEntryByIdUseCase(...args)).toBeInstanceOf(GetLedgerEntryByIdUseCase);
  });

  it.todo("Get ledger entries by id.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});