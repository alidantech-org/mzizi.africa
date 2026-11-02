import { describe, expect, it } from 'vitest';

import { GetBudgetByIdUseCase } from '#/modules/finance/finance-read/use-cases/get-budget-by-id.usecase';

/**
 * Get budgets by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('GetBudgetByIdUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof GetBudgetByIdUseCase>;
    expect(new GetBudgetByIdUseCase(...args)).toBeInstanceOf(GetBudgetByIdUseCase);
  });

  it.todo("Get budgets by id.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});