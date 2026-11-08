import { describe, expect, it } from 'vitest';

import { FindLegalProvisionsUseCase } from '#/modules/legal/legal-read/use-cases/find-legal-provisions.usecase';

/**
 * List legal provisions.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('FindLegalProvisionsUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof FindLegalProvisionsUseCase>;
    expect(new FindLegalProvisionsUseCase(...args)).toBeInstanceOf(FindLegalProvisionsUseCase);
  });

  it.todo("List legal provisions.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});