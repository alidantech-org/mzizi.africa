import { describe, expect, it } from 'vitest';

import { GetElectorateByIdUseCase } from '#/modules/elections/elections-read/use-cases/get-electorate-by-id.usecase';

/**
 * Get registered voters, turnout and ballot counts by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('GetElectorateByIdUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof GetElectorateByIdUseCase>;
    expect(new GetElectorateByIdUseCase(...args)).toBeInstanceOf(GetElectorateByIdUseCase);
  });

  it.todo("Get registered voters, turnout and ballot counts by id.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});