import { describe, expect, it } from 'vitest';

import { FindEvidenceReferencesUseCase } from '#/modules/audit/audit/use-cases/find-evidence-references.usecase';

/**
 * List evidence references.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('FindEvidenceReferencesUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof FindEvidenceReferencesUseCase>;
    expect(new FindEvidenceReferencesUseCase(...args)).toBeInstanceOf(FindEvidenceReferencesUseCase);
  });

  it.todo("List evidence references.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});