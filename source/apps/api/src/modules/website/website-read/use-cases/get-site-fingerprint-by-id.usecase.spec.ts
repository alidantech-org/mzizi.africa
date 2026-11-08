import { describe, expect, it } from 'vitest';

import { GetSiteFingerprintByIdUseCase } from '#/modules/website/website-read/use-cases/get-site-fingerprint-by-id.usecase';

/**
 * Get site fingerprints by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('GetSiteFingerprintByIdUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof GetSiteFingerprintByIdUseCase>;
    expect(new GetSiteFingerprintByIdUseCase(...args)).toBeInstanceOf(GetSiteFingerprintByIdUseCase);
  });

  it.todo("Get site fingerprints by id.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});