import { describe, expect, it } from 'vitest';

import { GetReviewDecisionByIdUseCase } from '#/modules/audit/audit/use-cases/get-review-decision-by-id.usecase';

/**
 * Get review decisions by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('GetReviewDecisionByIdUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof GetReviewDecisionByIdUseCase>;
    expect(new GetReviewDecisionByIdUseCase(...args)).toBeInstanceOf(GetReviewDecisionByIdUseCase);
  });

  it.todo("Get review decisions by id.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});