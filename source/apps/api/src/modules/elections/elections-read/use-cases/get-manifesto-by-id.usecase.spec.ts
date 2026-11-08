import { describe, expect, it } from 'vitest';

import { GetManifestoByIdUseCase } from '#/modules/elections/elections-read/use-cases/get-manifesto-by-id.usecase';

/**
 * Get manifestos by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('GetManifestoByIdUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof GetManifestoByIdUseCase>;
    expect(new GetManifestoByIdUseCase(...args)).toBeInstanceOf(GetManifestoByIdUseCase);
  });

  it.todo("Get manifestos by id.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});