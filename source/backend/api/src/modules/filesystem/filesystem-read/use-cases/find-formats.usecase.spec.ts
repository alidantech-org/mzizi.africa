import { describe, expect, it } from 'vitest';

import { FindFormatsUseCase } from '#/modules/filesystem/filesystem-read/use-cases/find-formats.usecase';

/**
 * List media formats.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('FindFormatsUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof FindFormatsUseCase>;
    expect(new FindFormatsUseCase(...args)).toBeInstanceOf(FindFormatsUseCase);
  });

  it.todo("List media formats.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});