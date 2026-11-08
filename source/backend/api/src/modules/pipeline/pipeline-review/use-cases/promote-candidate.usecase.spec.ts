import { describe, expect, it } from 'vitest';

import { PromoteCandidateUseCase } from '#/modules/pipeline/pipeline-review/use-cases/promote-candidate.usecase';

/**
 * Promote an approved candidate to a canonical record through the database engine.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('PromoteCandidateUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof PromoteCandidateUseCase>;
    expect(new PromoteCandidateUseCase(...args)).toBeInstanceOf(PromoteCandidateUseCase);
  });

  it.todo("Promote an approved candidate to a canonical record through the database engine.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
  it.todo("fails with Unauthorized (401)");
  it.todo("fails with Forbidden (403)");
});