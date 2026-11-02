import { describe, expect, it } from 'vitest';

import { FindBudgetsUseCase } from '#/modules/finance/finance-read/use-cases/find-budgets.usecase';

/**
 * List budgets.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('FindBudgetsUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof FindBudgetsUseCase>;
    expect(new FindBudgetsUseCase(...args)).toBeInstanceOf(FindBudgetsUseCase);
  });

  it.todo("List budgets.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});