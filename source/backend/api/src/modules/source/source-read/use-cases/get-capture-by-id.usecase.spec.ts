import { describe, expect, it } from 'vitest';

import { GetCaptureByIdUseCase } from '#/modules/source/source-read/use-cases/get-capture-by-id.usecase';

/**
 * Get captures of source documents by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('GetCaptureByIdUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof GetCaptureByIdUseCase>;
    expect(new GetCaptureByIdUseCase(...args)).toBeInstanceOf(GetCaptureByIdUseCase);
  });

  it.todo("Get captures of source documents by id.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});