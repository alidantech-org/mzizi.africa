import { describe, expect, it } from 'vitest';

import { GetEventByIdUseCase } from '#/modules/events/events-read/use-cases/get-event-by-id.usecase';

/**
 * Get events by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('GetEventByIdUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof GetEventByIdUseCase>;
    expect(new GetEventByIdUseCase(...args)).toBeInstanceOf(GetEventByIdUseCase);
  });

  it.todo("Get events by id.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});