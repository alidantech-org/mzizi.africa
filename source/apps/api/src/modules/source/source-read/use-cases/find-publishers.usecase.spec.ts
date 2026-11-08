import { describe, expect, it } from 'vitest';

import { FindPublishersUseCase } from '#/modules/source/source-read/use-cases/find-publishers.usecase';

/**
 * List publishers.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('FindPublishersUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof FindPublishersUseCase>;
    expect(new FindPublishersUseCase(...args)).toBeInstanceOf(FindPublishersUseCase);
  });

  it.todo("List publishers.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});