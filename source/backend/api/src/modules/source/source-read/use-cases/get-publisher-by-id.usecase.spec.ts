import { describe, expect, it } from 'vitest';

import { GetPublisherByIdUseCase } from '#/modules/source/source-read/use-cases/get-publisher-by-id.usecase';

/**
 * Get publishers by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('GetPublisherByIdUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof GetPublisherByIdUseCase>;
    expect(new GetPublisherByIdUseCase(...args)).toBeInstanceOf(GetPublisherByIdUseCase);
  });

  it.todo("Get publishers by id.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});