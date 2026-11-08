import { describe, expect, it } from 'vitest';

import { FindEventsUseCase } from '#/modules/events/events-read/use-cases/find-events.usecase';

/**
 * List events.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('FindEventsUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof FindEventsUseCase>;
    expect(new FindEventsUseCase(...args)).toBeInstanceOf(FindEventsUseCase);
  });

  it.todo("List events.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});