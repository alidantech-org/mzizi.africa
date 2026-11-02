import { describe, expect, it } from 'vitest';

import { GetStructureByIdUseCase } from '#/modules/website/website-read/use-cases/get-structure-by-id.usecase';

/**
 * Get site structures by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('GetStructureByIdUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof GetStructureByIdUseCase>;
    expect(new GetStructureByIdUseCase(...args)).toBeInstanceOf(GetStructureByIdUseCase);
  });

  it.todo("Get site structures by id.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});