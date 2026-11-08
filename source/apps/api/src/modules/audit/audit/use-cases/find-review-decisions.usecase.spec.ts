import { describe, expect, it } from 'vitest';

import { FindReviewDecisionsUseCase } from '#/modules/audit/audit/use-cases/find-review-decisions.usecase';

/**
 * List review decisions.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('FindReviewDecisionsUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof FindReviewDecisionsUseCase>;
    expect(new FindReviewDecisionsUseCase(...args)).toBeInstanceOf(FindReviewDecisionsUseCase);
  });

  it.todo("List review decisions.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});