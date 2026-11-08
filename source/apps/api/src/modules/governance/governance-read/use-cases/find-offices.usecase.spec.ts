import { describe, expect, it } from 'vitest';

import { FindOfficesUseCase } from '#/modules/governance/governance-read/use-cases/find-offices.usecase';

/**
 * List offices.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('FindOfficesUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof FindOfficesUseCase>;
    expect(new FindOfficesUseCase(...args)).toBeInstanceOf(FindOfficesUseCase);
  });

  it.todo("List offices.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});