import { describe, expect, it } from 'vitest';

import { GetInstitutionRelationshipByIdUseCase } from '#/modules/governance/governance-read/use-cases/get-institution-relationship-by-id.usecase';

/**
 * Get institution relationships by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('GetInstitutionRelationshipByIdUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof GetInstitutionRelationshipByIdUseCase>;
    expect(new GetInstitutionRelationshipByIdUseCase(...args)).toBeInstanceOf(GetInstitutionRelationshipByIdUseCase);
  });

  it.todo("Get institution relationships by id.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});