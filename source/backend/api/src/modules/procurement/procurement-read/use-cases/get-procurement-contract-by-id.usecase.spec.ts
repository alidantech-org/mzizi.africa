import { describe, expect, it } from 'vitest';

import { GetProcurementContractByIdUseCase } from '#/modules/procurement/procurement-read/use-cases/get-procurement-contract-by-id.usecase';

/**
 * Get contracts by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('GetProcurementContractByIdUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof GetProcurementContractByIdUseCase>;
    expect(new GetProcurementContractByIdUseCase(...args)).toBeInstanceOf(GetProcurementContractByIdUseCase);
  });

  it.todo("Get contracts by id.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});