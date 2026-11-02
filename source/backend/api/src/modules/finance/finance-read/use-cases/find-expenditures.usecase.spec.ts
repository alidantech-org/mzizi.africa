import { describe, expect, it } from 'vitest';

import { FindExpendituresUseCase } from '#/modules/finance/finance-read/use-cases/find-expenditures.usecase';

/**
 * List expenditures.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('FindExpendituresUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof FindExpendituresUseCase>;
    expect(new FindExpendituresUseCase(...args)).toBeInstanceOf(FindExpendituresUseCase);
  });

  it.todo("List expenditures.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});