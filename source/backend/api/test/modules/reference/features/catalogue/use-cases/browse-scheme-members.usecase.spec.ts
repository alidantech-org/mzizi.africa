import { describe, expect, it } from "vitest";

import { BrowseSchemeMembersUseCase } from "#/modules/reference/features/catalogue/use-cases/browse-scheme-members.usecase";

/**
 * Page through the members of one scheme, including superseded members.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe("BrowseSchemeMembersUseCase", () => {
  it("can be constructed", () => {
    const args = [] as unknown as ConstructorParameters<typeof BrowseSchemeMembersUseCase>;
    expect(new BrowseSchemeMembersUseCase(...args)).toBeInstanceOf(BrowseSchemeMembersUseCase);
  });

  it.todo("Page through the members of one scheme, including superseded members.");
});
