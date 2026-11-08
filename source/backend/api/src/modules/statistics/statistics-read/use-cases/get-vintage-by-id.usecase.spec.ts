import { describe, expect, it } from 'vitest';

import { GetVintageByIdUseCase } from '#/modules/statistics/statistics-read/use-cases/get-vintage-by-id.usecase';

/**
 * Get release vintages by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('GetVintageByIdUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof GetVintageByIdUseCase>;
    expect(new GetVintageByIdUseCase(...args)).toBeInstanceOf(GetVintageByIdUseCase);
  });

  it.todo("Get release vintages by id.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});