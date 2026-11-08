import { describe, expect, it } from 'vitest';

import { GetManifestoCommitmentByIdUseCase } from '#/modules/elections/elections-read/use-cases/get-manifesto-commitment-by-id.usecase';

/**
 * Get manifesto commitments by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('GetManifestoCommitmentByIdUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof GetManifestoCommitmentByIdUseCase>;
    expect(new GetManifestoCommitmentByIdUseCase(...args)).toBeInstanceOf(GetManifestoCommitmentByIdUseCase);
  });

  it.todo("Get manifesto commitments by id.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});