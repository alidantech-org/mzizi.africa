import { describe, expect, it } from 'vitest';

import { GetEvidenceReferenceByIdUseCase } from '#/modules/audit/audit/use-cases/get-evidence-reference-by-id.usecase';

/**
 * Get evidence references by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('GetEvidenceReferenceByIdUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof GetEvidenceReferenceByIdUseCase>;
    expect(new GetEvidenceReferenceByIdUseCase(...args)).toBeInstanceOf(GetEvidenceReferenceByIdUseCase);
  });

  it.todo("Get evidence references by id.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});