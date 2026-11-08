import { describe, expect, it } from 'vitest';

import { FindFoldersUseCase } from '#/modules/filesystem/filesystem-read/use-cases/find-folders.usecase';

/**
 * List public folders.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('FindFoldersUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof FindFoldersUseCase>;
    expect(new FindFoldersUseCase(...args)).toBeInstanceOf(FindFoldersUseCase);
  });

  it.todo("List public folders.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});