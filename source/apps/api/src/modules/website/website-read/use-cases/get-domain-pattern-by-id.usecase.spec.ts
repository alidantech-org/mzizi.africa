import { describe, expect, it } from 'vitest';

import { GetDomainPatternByIdUseCase } from '#/modules/website/website-read/use-cases/get-domain-pattern-by-id.usecase';

/**
 * Get domain patterns by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('GetDomainPatternByIdUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof GetDomainPatternByIdUseCase>;
    expect(new GetDomainPatternByIdUseCase(...args)).toBeInstanceOf(GetDomainPatternByIdUseCase);
  });

  it.todo("Get domain patterns by id.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});