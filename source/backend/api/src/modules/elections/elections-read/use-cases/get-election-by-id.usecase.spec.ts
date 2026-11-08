import { describe, expect, it } from 'vitest';

import { GetElectionByIdUseCase } from '#/modules/elections/elections-read/use-cases/get-election-by-id.usecase';

/**
 * Get elections by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('GetElectionByIdUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof GetElectionByIdUseCase>;
    expect(new GetElectionByIdUseCase(...args)).toBeInstanceOf(GetElectionByIdUseCase);
  });

  it.todo("Get elections by id.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});