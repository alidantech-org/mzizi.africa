import { describe, expect, it } from 'vitest';

import { FindElectionsUseCase } from '#/modules/elections/elections-read/use-cases/find-elections.usecase';

/**
 * List elections.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('FindElectionsUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof FindElectionsUseCase>;
    expect(new FindElectionsUseCase(...args)).toBeInstanceOf(FindElectionsUseCase);
  });

  it.todo("List elections.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});