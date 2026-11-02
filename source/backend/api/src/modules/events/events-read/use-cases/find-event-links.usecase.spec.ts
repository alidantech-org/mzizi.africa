import { describe, expect, it } from 'vitest';

import { FindEventLinksUseCase } from '#/modules/events/events-read/use-cases/find-event-links.usecase';

/**
 * List event links.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe('FindEventLinksUseCase', () => {
  it('can be constructed', () => {
    const args = [] as unknown as ConstructorParameters<typeof FindEventLinksUseCase>;
    expect(new FindEventLinksUseCase(...args)).toBeInstanceOf(FindEventLinksUseCase);
  });

  it.todo("List event links.");
  it.todo("fails with Bad Request (400)");
  it.todo("fails with Not Found (404)");
  it.todo("fails with Validation Error (422)");
  it.todo("fails with Internal Error (500)");
});