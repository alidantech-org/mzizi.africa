import { describe, expect, it } from 'vitest';

import { GetGeographyGovernanceUseCase } from '#/modules/governance/governance-read/use-cases/get-geography-governance.usecase';

/**
 * Institutions, offices and current office holders linked to a geography entity.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('GetGeographyGovernanceUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof GetGeographyGovernanceUseCase>;
    expect(new GetGeographyGovernanceUseCase(...args)).toBeInstanceOf(GetGeographyGovernanceUseCase);
  });

  it.todo("Institutions, offices and current office holders linked to a geography entity.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});