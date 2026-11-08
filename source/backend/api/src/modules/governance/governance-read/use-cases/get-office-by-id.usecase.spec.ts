import { describe, expect, it } from 'vitest';

import { GetOfficeByIdUseCase } from '#/modules/governance/governance-read/use-cases/get-office-by-id.usecase';

/**
 * Get offices by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('GetOfficeByIdUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof GetOfficeByIdUseCase>;
    expect(new GetOfficeByIdUseCase(...args)).toBeInstanceOf(GetOfficeByIdUseCase);
  });

  it.todo("Get offices by id.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});