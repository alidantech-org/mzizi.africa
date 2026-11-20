import { describe, expect, it } from "vitest";

import { GetExplorerNavigationUseCase } from "#/modules/explorer/features/explorer/use-cases/get-explorer-navigation.usecase";

/**
 * Which navigation subjects have recorded data for one explicit country. Availability follows the data, not a list kept by the client.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe("GetExplorerNavigationUseCase", () => {
  it("can be constructed", () => {
    const args = [] as unknown as ConstructorParameters<typeof GetExplorerNavigationUseCase>;
    expect(new GetExplorerNavigationUseCase(...args)).toBeInstanceOf(GetExplorerNavigationUseCase);
  });

  it.todo(
    "Which navigation subjects have recorded data for one explicit country. Availability follows the data, not a list kept by the client.",
  );
});
