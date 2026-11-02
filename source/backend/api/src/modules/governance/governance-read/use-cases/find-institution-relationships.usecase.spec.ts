import { describe, expect, it } from 'vitest';

import { FindInstitutionRelationshipsUseCase } from '#/modules/governance/governance-read/use-cases/find-institution-relationships.usecase';

/**
 * List institution relationships.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('FindInstitutionRelationshipsUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof FindInstitutionRelationshipsUseCase>;
    expect(new FindInstitutionRelationshipsUseCase(...args)).toBeInstanceOf(FindInstitutionRelationshipsUseCase);
  });

  it.todo("List institution relationships.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});