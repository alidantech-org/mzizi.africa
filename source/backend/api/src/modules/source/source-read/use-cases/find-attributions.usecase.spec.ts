import { describe, expect, it } from 'vitest';

import { FindAttributionsUseCase } from '#/modules/source/source-read/use-cases/find-attributions.usecase';

/**
 * List attributions.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('FindAttributionsUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof FindAttributionsUseCase>;
    expect(new FindAttributionsUseCase(...args)).toBeInstanceOf(FindAttributionsUseCase);
  });

  it.todo("List attributions.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});