import { describe, expect, it } from 'vitest';

import { FindLegalAmendmentsUseCase } from '#/modules/legal/legal-read/use-cases/find-legal-amendments.usecase';

/**
 * List legal amendments.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('FindLegalAmendmentsUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof FindLegalAmendmentsUseCase>;
    expect(new FindLegalAmendmentsUseCase(...args)).toBeInstanceOf(FindLegalAmendmentsUseCase);
  });

  it.todo("List legal amendments.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});