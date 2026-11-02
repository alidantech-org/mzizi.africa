import { describe, expect, it } from 'vitest';

import { FindInstitutionsUseCase } from '#/modules/governance/governance-read/use-cases/find-institutions.usecase';

/**
 * List institutions.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('FindInstitutionsUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof FindInstitutionsUseCase>;
    expect(new FindInstitutionsUseCase(...args)).toBeInstanceOf(FindInstitutionsUseCase);
  });

  it.todo("List institutions.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});