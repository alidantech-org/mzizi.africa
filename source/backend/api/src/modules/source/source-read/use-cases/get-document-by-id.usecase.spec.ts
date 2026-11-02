import { describe, expect, it } from 'vitest';

import { GetDocumentByIdUseCase } from '#/modules/source/source-read/use-cases/get-document-by-id.usecase';

/**
 * Get source documents by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('GetDocumentByIdUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof GetDocumentByIdUseCase>;
    expect(new GetDocumentByIdUseCase(...args)).toBeInstanceOf(GetDocumentByIdUseCase);
  });

  it.todo("Get source documents by id.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});