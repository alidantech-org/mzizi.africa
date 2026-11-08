import { describe, expect, it } from 'vitest';

import { FindReferendumResultsUseCase } from '#/modules/elections/elections-read/use-cases/find-referendum-results.usecase';

/**
 * List referendum results.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('FindReferendumResultsUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof FindReferendumResultsUseCase>;
    expect(new FindReferendumResultsUseCase(...args)).toBeInstanceOf(FindReferendumResultsUseCase);
  });

  it.todo("List referendum results.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});