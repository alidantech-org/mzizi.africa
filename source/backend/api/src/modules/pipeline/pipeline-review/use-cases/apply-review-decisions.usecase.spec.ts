import { describe, expect, it } from 'vitest';

import { ApplyReviewDecisionsUseCase } from '#/modules/pipeline/pipeline-review/use-cases/apply-review-decisions.usecase';

/**
 * Apply recorded review decisions to their candidates (approved, rejected, held) through the database engine.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('ApplyReviewDecisionsUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof ApplyReviewDecisionsUseCase>;
    expect(new ApplyReviewDecisionsUseCase(...args)).toBeInstanceOf(ApplyReviewDecisionsUseCase);
  });

  it.todo("Apply recorded review decisions to their candidates (approved, rejected, held) through the database engine.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
  it.todo("fails with Unauthorized (401)");
  it.todo("fails with Forbidden (403)");
});