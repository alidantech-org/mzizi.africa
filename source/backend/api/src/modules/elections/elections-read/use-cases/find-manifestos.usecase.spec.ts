import { describe, expect, it } from 'vitest';

import { FindManifestosUseCase } from '#/modules/elections/elections-read/use-cases/find-manifestos.usecase';

/**
 * List manifestos.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('FindManifestosUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof FindManifestosUseCase>;
    expect(new FindManifestosUseCase(...args)).toBeInstanceOf(FindManifestosUseCase);
  });

  it.todo("List manifestos.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});