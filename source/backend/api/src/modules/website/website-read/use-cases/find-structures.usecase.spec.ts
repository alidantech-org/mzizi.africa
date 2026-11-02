import { describe, expect, it } from 'vitest';

import { FindStructuresUseCase } from '#/modules/website/website-read/use-cases/find-structures.usecase';

/**
 * List site structures.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('FindStructuresUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof FindStructuresUseCase>;
    expect(new FindStructuresUseCase(...args)).toBeInstanceOf(FindStructuresUseCase);
  });

  it.todo("List site structures.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});