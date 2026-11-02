import { describe, expect, it } from 'vitest';

import { FindStructureFilesUseCase } from '#/modules/website/website-read/use-cases/find-structure-files.usecase';

/**
 * List files of structure versions.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('FindStructureFilesUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof FindStructureFilesUseCase>;
    expect(new FindStructureFilesUseCase(...args)).toBeInstanceOf(FindStructureFilesUseCase);
  });

  it.todo("List files of structure versions.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});