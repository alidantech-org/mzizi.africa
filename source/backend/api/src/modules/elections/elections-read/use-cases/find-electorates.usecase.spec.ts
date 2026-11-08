import { describe, expect, it } from 'vitest';

import { FindElectoratesUseCase } from '#/modules/elections/elections-read/use-cases/find-electorates.usecase';

/**
 * List registered voters, turnout and ballot counts.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('FindElectoratesUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof FindElectoratesUseCase>;
    expect(new FindElectoratesUseCase(...args)).toBeInstanceOf(FindElectoratesUseCase);
  });

  it.todo("List registered voters, turnout and ballot counts.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});