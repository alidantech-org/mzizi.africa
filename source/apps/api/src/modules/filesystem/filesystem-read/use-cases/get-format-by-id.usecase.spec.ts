import { describe, expect, it } from 'vitest';

import { GetFormatByIdUseCase } from '#/modules/filesystem/filesystem-read/use-cases/get-format-by-id.usecase';

/**
 * Get media formats by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('GetFormatByIdUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof GetFormatByIdUseCase>;
    expect(new GetFormatByIdUseCase(...args)).toBeInstanceOf(GetFormatByIdUseCase);
  });

  it.todo("Get media formats by id.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});