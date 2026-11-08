import { describe, expect, it } from 'vitest';

import { GetSelectionProcedureByIdUseCase } from '#/modules/governance/governance-read/use-cases/get-selection-procedure-by-id.usecase';

/**
 * Get selection procedures by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('GetSelectionProcedureByIdUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof GetSelectionProcedureByIdUseCase>;
    expect(new GetSelectionProcedureByIdUseCase(...args)).toBeInstanceOf(GetSelectionProcedureByIdUseCase);
  });

  it.todo("Get selection procedures by id.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});