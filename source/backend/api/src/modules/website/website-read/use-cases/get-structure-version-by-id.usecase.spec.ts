import { describe, expect, it } from 'vitest';

import { GetStructureVersionByIdUseCase } from '#/modules/website/website-read/use-cases/get-structure-version-by-id.usecase';

/**
 * Get structure versions by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('GetStructureVersionByIdUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof GetStructureVersionByIdUseCase>;
    expect(new GetStructureVersionByIdUseCase(...args)).toBeInstanceOf(GetStructureVersionByIdUseCase);
  });

  it.todo("Get structure versions by id.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});