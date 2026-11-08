import { describe, expect, it } from 'vitest';

import { ApproveAssessmentUseCase } from '#/modules/pipeline/pipeline-review/use-cases/approve-assessment.usecase';

/**
 * Approve a site assessment; only a named human account holding assessment.approve.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('ApproveAssessmentUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof ApproveAssessmentUseCase>;
    expect(new ApproveAssessmentUseCase(...args)).toBeInstanceOf(ApproveAssessmentUseCase);
  });

  it.todo("Approve a site assessment; only a named human account holding assessment.approve.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
  it.todo("fails with Unauthorized (401)");
  it.todo("fails with Forbidden (403)");
});