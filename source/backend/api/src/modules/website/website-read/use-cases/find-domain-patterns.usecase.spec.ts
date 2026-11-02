import { describe, expect, it } from 'vitest';

import { FindDomainPatternsUseCase } from '#/modules/website/website-read/use-cases/find-domain-patterns.usecase';

/**
 * List domain patterns.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('FindDomainPatternsUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof FindDomainPatternsUseCase>;
    expect(new FindDomainPatternsUseCase(...args)).toBeInstanceOf(FindDomainPatternsUseCase);
  });

  it.todo("List domain patterns.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});