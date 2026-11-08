import { describe, expect, it } from 'vitest';

import { GetFolderByIdUseCase } from '#/modules/filesystem/filesystem-read/use-cases/get-folder-by-id.usecase';

/**
 * Get public folders by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('GetFolderByIdUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof GetFolderByIdUseCase>;
    expect(new GetFolderByIdUseCase(...args)).toBeInstanceOf(GetFolderByIdUseCase);
  });

  it.todo("Get public folders by id.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});