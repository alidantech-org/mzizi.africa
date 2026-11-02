import { describe, expect, it } from 'vitest';

import { FindLegalInstrumentsUseCase } from '#/modules/legal/legal-read/use-cases/find-legal-instruments.usecase';

/**
 * List legal instruments.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('FindLegalInstrumentsUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof FindLegalInstrumentsUseCase>;
    expect(new FindLegalInstrumentsUseCase(...args)).toBeInstanceOf(FindLegalInstrumentsUseCase);
  });

  it.todo("List legal instruments.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});