import { describe, expect, it } from 'vitest';

import { FindSiteFingerprintsUseCase } from '#/modules/website/website-read/use-cases/find-site-fingerprints.usecase';

/**
 * List site fingerprints.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('FindSiteFingerprintsUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof FindSiteFingerprintsUseCase>;
    expect(new FindSiteFingerprintsUseCase(...args)).toBeInstanceOf(FindSiteFingerprintsUseCase);
  });

  it.todo("List site fingerprints.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});