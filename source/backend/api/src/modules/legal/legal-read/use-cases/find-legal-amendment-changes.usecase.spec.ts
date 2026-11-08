import { describe, expect, it } from 'vitest';

import { FindLegalAmendmentChangesUseCase } from '#/modules/legal/legal-read/use-cases/find-legal-amendment-changes.usecase';

/**
 * List legal amendment changes.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('FindLegalAmendmentChangesUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof FindLegalAmendmentChangesUseCase>;
    expect(new FindLegalAmendmentChangesUseCase(...args)).toBeInstanceOf(FindLegalAmendmentChangesUseCase);
  });

  it.todo("List legal amendment changes.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});