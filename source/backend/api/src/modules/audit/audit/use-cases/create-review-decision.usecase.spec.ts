import { describe, expect, it } from 'vitest';

import { CreateReviewDecisionUseCase } from '#/modules/audit/audit/use-cases/create-review-decision.usecase';

/**
 * Record a review decision about a record.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('CreateReviewDecisionUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof CreateReviewDecisionUseCase>;
    expect(new CreateReviewDecisionUseCase(...args)).toBeInstanceOf(CreateReviewDecisionUseCase);
  });

  it.todo("Record a review decision about a record.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
  it.todo("fails with Unauthorized (401)");
  it.todo("fails with Forbidden (403)");
});