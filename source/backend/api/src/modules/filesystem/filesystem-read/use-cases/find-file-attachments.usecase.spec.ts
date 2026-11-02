import { describe, expect, it } from 'vitest';

import { FindFileAttachmentsUseCase } from '#/modules/filesystem/filesystem-read/use-cases/find-file-attachments.usecase';

/**
 * List attachments of public files.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('FindFileAttachmentsUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof FindFileAttachmentsUseCase>;
    expect(new FindFileAttachmentsUseCase(...args)).toBeInstanceOf(FindFileAttachmentsUseCase);
  });

  it.todo("List attachments of public files.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});