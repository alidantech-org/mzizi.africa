import { describe, expect, it } from 'vitest';

import { GetContractMilestoneByIdUseCase } from '#/modules/procurement/procurement-read/use-cases/get-contract-milestone-by-id.usecase';

/**
 * Get contract milestones by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('GetContractMilestoneByIdUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof GetContractMilestoneByIdUseCase>;
    expect(new GetContractMilestoneByIdUseCase(...args)).toBeInstanceOf(GetContractMilestoneByIdUseCase);
  });

  it.todo("Get contract milestones by id.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});