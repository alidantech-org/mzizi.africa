import { describe, expect, it } from 'vitest';

import { FindClassificationRecordsUseCase } from '#/modules/reference/reference-read/use-cases/find-classification-records.usecase';

/**
 * List classification records.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('FindClassificationRecordsUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof FindClassificationRecordsUseCase>;
    expect(new FindClassificationRecordsUseCase(...args)).toBeInstanceOf(FindClassificationRecordsUseCase);
  });

  it.todo("List classification records.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});