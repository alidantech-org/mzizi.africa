import { describe, expect, it } from 'vitest';

import { DraftAssessmentUseCase } from '#/modules/pipeline/pipeline-review/use-cases/draft-assessment.usecase';

/**
 * Draft a site assessment as in_review; a draft never authorises collection.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('DraftAssessmentUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof DraftAssessmentUseCase>;
    expect(new DraftAssessmentUseCase(...args)).toBeInstanceOf(DraftAssessmentUseCase);
  });

  it.todo("Draft a site assessment as in_review; a draft never authorises collection.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
  it.todo("fails with Unauthorized (401)");
  it.todo("fails with Forbidden (403)");
});