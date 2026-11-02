import { describe, expect, it } from 'vitest';

import { FindElectionResultsUseCase } from '#/modules/elections/elections-read/use-cases/find-election-results.usecase';

/**
 * List election results.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('FindElectionResultsUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof FindElectionResultsUseCase>;
    expect(new FindElectionResultsUseCase(...args)).toBeInstanceOf(FindElectionResultsUseCase);
  });

  it.todo("List election results.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});