import { describe, expect, it } from 'vitest';

import { GetClassificationRecordByIdUseCase } from '#/modules/reference/reference-read/use-cases/get-classification-record-by-id.usecase';

/**
 * Get classification records by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('GetClassificationRecordByIdUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof GetClassificationRecordByIdUseCase>;
    expect(new GetClassificationRecordByIdUseCase(...args)).toBeInstanceOf(GetClassificationRecordByIdUseCase);
  });

  it.todo("Get classification records by id.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});