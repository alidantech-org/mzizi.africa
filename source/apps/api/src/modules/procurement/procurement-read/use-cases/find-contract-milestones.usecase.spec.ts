import { describe, expect, it } from 'vitest';

import { FindContractMilestonesUseCase } from '#/modules/procurement/procurement-read/use-cases/find-contract-milestones.usecase';

/**
 * List contract milestones.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('FindContractMilestonesUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof FindContractMilestonesUseCase>;
    expect(new FindContractMilestonesUseCase(...args)).toBeInstanceOf(FindContractMilestonesUseCase);
  });

  it.todo("List contract milestones.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});