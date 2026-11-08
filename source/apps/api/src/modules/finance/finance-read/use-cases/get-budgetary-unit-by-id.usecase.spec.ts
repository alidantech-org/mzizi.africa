import { describe, expect, it } from 'vitest';

import { GetBudgetaryUnitByIdUseCase } from '#/modules/finance/finance-read/use-cases/get-budgetary-unit-by-id.usecase';

/**
 * Get budgetary units by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('GetBudgetaryUnitByIdUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof GetBudgetaryUnitByIdUseCase>;
    expect(new GetBudgetaryUnitByIdUseCase(...args)).toBeInstanceOf(GetBudgetaryUnitByIdUseCase);
  });

  it.todo("Get budgetary units by id.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});