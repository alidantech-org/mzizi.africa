import { describe, expect, it } from 'vitest';

import { FindStructureVersionsUseCase } from '#/modules/pipeline/pipeline-review/use-cases/find-structure-versions.usecase';

/**
 * List site structure versions.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('FindStructureVersionsUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof FindStructureVersionsUseCase>;
    expect(new FindStructureVersionsUseCase(...args)).toBeInstanceOf(FindStructureVersionsUseCase);
  });

  it.todo("List site structure versions.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
  it.todo("fails with Unauthorized (401)");
  it.todo("fails with Forbidden (403)");
});