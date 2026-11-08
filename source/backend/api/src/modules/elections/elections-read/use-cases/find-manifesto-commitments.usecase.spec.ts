import { describe, expect, it } from 'vitest';

import { FindManifestoCommitmentsUseCase } from '#/modules/elections/elections-read/use-cases/find-manifesto-commitments.usecase';

/**
 * List manifesto commitments.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('FindManifestoCommitmentsUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof FindManifestoCommitmentsUseCase>;
    expect(new FindManifestoCommitmentsUseCase(...args)).toBeInstanceOf(FindManifestoCommitmentsUseCase);
  });

  it.todo("List manifesto commitments.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});