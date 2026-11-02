import { describe, expect, it } from 'vitest';

import { FindDocumentsUseCase } from '#/modules/source/source-read/use-cases/find-documents.usecase';

/**
 * List source documents.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('FindDocumentsUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof FindDocumentsUseCase>;
    expect(new FindDocumentsUseCase(...args)).toBeInstanceOf(FindDocumentsUseCase);
  });

  it.todo("List source documents.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});