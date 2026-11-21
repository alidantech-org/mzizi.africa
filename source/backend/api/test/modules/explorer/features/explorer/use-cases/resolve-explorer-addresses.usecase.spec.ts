import { describe, expect, it } from "vitest";

import { ResolveExplorerAddressesUseCase } from "#/modules/explorer/features/explorer/use-cases/resolve-explorer-addresses.usecase";

/**
 * Names and places above them for a list of addresses (saved places), in one language. A body keeps the list out of the address.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe("ResolveExplorerAddressesUseCase", () => {
  it("can be constructed", () => {
    const args = [] as unknown as ConstructorParameters<typeof ResolveExplorerAddressesUseCase>;
    expect(new ResolveExplorerAddressesUseCase(...args)).toBeInstanceOf(
      ResolveExplorerAddressesUseCase,
    );
  });

  it.todo(
    "Names and places above them for a list of addresses (saved places), in one language. A body keeps the list out of the address.",
  );
});
