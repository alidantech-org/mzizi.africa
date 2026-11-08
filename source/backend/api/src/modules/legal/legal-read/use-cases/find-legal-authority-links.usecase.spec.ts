import { describe, expect, it } from 'vitest';

import { FindLegalAuthorityLinksUseCase } from '#/modules/legal/legal-read/use-cases/find-legal-authority-links.usecase';

/**
 * List legal authority links.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('FindLegalAuthorityLinksUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof FindLegalAuthorityLinksUseCase>;
    expect(new FindLegalAuthorityLinksUseCase(...args)).toBeInstanceOf(FindLegalAuthorityLinksUseCase);
  });

  it.todo("List legal authority links.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});