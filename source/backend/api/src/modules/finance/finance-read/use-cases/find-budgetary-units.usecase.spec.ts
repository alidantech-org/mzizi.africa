import { describe, expect, it } from 'vitest';

import { FindBudgetaryUnitsUseCase } from '#/modules/finance/finance-read/use-cases/find-budgetary-units.usecase';

/**
 * List budgetary units.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('FindBudgetaryUnitsUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof FindBudgetaryUnitsUseCase>;
    expect(new FindBudgetaryUnitsUseCase(...args)).toBeInstanceOf(FindBudgetaryUnitsUseCase);
  });

  it.todo("List budgetary units.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});