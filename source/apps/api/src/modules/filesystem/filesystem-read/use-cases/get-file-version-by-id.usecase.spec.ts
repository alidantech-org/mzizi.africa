import { describe, expect, it } from 'vitest';

import { GetFileVersionByIdUseCase } from '#/modules/filesystem/filesystem-read/use-cases/get-file-version-by-id.usecase';

/**
 * Get versions of public files by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('GetFileVersionByIdUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof GetFileVersionByIdUseCase>;
    expect(new GetFileVersionByIdUseCase(...args)).toBeInstanceOf(GetFileVersionByIdUseCase);
  });

  it.todo("Get versions of public files by id.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});