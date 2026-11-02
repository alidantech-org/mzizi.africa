import { describe, expect, it } from 'vitest';

import { FindSelectionStagesUseCase } from '#/modules/governance/governance-read/use-cases/find-selection-stages.usecase';

/**
 * List selection stages.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('FindSelectionStagesUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof FindSelectionStagesUseCase>;
    expect(new FindSelectionStagesUseCase(...args)).toBeInstanceOf(FindSelectionStagesUseCase);
  });

  it.todo("List selection stages.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});