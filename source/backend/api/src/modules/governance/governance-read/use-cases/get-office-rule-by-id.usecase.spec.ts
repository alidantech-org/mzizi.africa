import { describe, expect, it } from 'vitest';

import { GetOfficeRuleByIdUseCase } from '#/modules/governance/governance-read/use-cases/get-office-rule-by-id.usecase';

/**
 * Get office rules by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('GetOfficeRuleByIdUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof GetOfficeRuleByIdUseCase>;
    expect(new GetOfficeRuleByIdUseCase(...args)).toBeInstanceOf(GetOfficeRuleByIdUseCase);
  });

  it.todo("Get office rules by id.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});