import { describe, expect, it } from "vitest";

import { GetExplorerLocationUseCase } from "#/modules/explorer/features/explorer/use-cases/get-explorer-location.usecase";

/**
 * Everything the location UI shows for one place, resolved on the server from the readable address: the place, its chain, every level kind, the places inside the country root, each ancestor and the place, and one page of a search or level list. Clients send slugs, never identities.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe("GetExplorerLocationUseCase", () => {
  it("can be constructed", () => {
    const args = [] as unknown as ConstructorParameters<typeof GetExplorerLocationUseCase>;
    expect(new GetExplorerLocationUseCase(...args)).toBeInstanceOf(GetExplorerLocationUseCase);
  });

  it.todo(
    "Everything the location UI shows for one place, resolved on the server from the readable address: the place, its chain, every level kind, the places inside the country root, each ancestor and the place, and one page of a search or level list. Clients send slugs, never identities.",
  );
});
