import { describe, expect, it } from 'vitest';

import { FindFilesUseCase } from '#/modules/filesystem/filesystem-read/use-cases/find-files.usecase';

/**
 * List public files.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('FindFilesUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof FindFilesUseCase>;
    expect(new FindFilesUseCase(...args)).toBeInstanceOf(FindFilesUseCase);
  });

  it.todo("List public files.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});