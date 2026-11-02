import { describe, expect, it } from 'vitest';

import { GetLegalInstrumentByIdUseCase } from '#/modules/legal/legal-read/use-cases/get-legal-instrument-by-id.usecase';

/**
 * Get legal instruments by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('GetLegalInstrumentByIdUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof GetLegalInstrumentByIdUseCase>;
    expect(new GetLegalInstrumentByIdUseCase(...args)).toBeInstanceOf(GetLegalInstrumentByIdUseCase);
  });

  it.todo("Get legal instruments by id.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});