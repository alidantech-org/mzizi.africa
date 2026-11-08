import { describe, expect, it } from 'vitest';

import { RejectAssessmentUseCase } from '#/modules/pipeline/pipeline-review/use-cases/reject-assessment.usecase';

/**
 * Reject a site assessment; only a named human account holding assessment.approve.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('RejectAssessmentUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof RejectAssessmentUseCase>;
    expect(new RejectAssessmentUseCase(...args)).toBeInstanceOf(RejectAssessmentUseCase);
  });

  it.todo("Reject a site assessment; only a named human account holding assessment.approve.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
  it.todo("fails with Unauthorized (401)");
  it.todo("fails with Forbidden (403)");
});