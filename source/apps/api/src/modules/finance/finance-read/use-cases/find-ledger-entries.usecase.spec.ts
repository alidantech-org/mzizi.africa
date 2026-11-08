import { describe, expect, it } from 'vitest';

import { FindLedgerEntriesUseCase } from '#/modules/finance/finance-read/use-cases/find-ledger-entries.usecase';

/**
 * List ledger entries.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('FindLedgerEntriesUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof FindLedgerEntriesUseCase>;
    expect(new FindLedgerEntriesUseCase(...args)).toBeInstanceOf(FindLedgerEntriesUseCase);
  });

  it.todo("List ledger entries.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});