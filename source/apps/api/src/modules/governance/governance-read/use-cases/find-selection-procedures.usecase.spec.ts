import { describe, expect, it } from 'vitest';

import { FindSelectionProceduresUseCase } from '#/modules/governance/governance-read/use-cases/find-selection-procedures.usecase';

/**
 * List selection procedures.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('FindSelectionProceduresUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof FindSelectionProceduresUseCase>;
    expect(new FindSelectionProceduresUseCase(...args)).toBeInstanceOf(FindSelectionProceduresUseCase);
  });

  it.todo("List selection procedures.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});