import { describe, expect, it } from "vitest";

import { BrowseSourcesUseCase } from "#/modules/locality/features/places/use-cases/browse-sources.usecase";

/**
 * The data sources behind the platform, with their publisher and how many artifacts and citations each has.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe("BrowseSourcesUseCase", () => {
  it("can be constructed", () => {
    const args = [] as unknown as ConstructorParameters<typeof BrowseSourcesUseCase>;
    expect(new BrowseSourcesUseCase(...args)).toBeInstanceOf(BrowseSourcesUseCase);
  });

  it.todo(
    "The data sources behind the platform, with their publisher and how many artifacts and citations each has.",
  );
});
