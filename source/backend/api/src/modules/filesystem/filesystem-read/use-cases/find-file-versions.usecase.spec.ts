import { describe, expect, it } from 'vitest';

import { FindFileVersionsUseCase } from '#/modules/filesystem/filesystem-read/use-cases/find-file-versions.usecase';

/**
 * List versions of public files.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('FindFileVersionsUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof FindFileVersionsUseCase>;
    expect(new FindFileVersionsUseCase(...args)).toBeInstanceOf(FindFileVersionsUseCase);
  });

  it.todo("List versions of public files.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});