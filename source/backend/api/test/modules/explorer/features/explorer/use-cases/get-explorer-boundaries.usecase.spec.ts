import { describe, expect, it } from "vitest";

import { GetExplorerBoundariesUseCase } from "#/modules/explorer/features/explorer/use-cases/get-explorer-boundaries.usecase";

/**
 * Simplified boundaries to draw a map: the place itself or the places directly inside it, from the recorded geometries, resolved from the readable address. Places with no recorded boundary are counted, never drawn.
 *
 * Scaffolded by Dryv once; this file belongs to the project. The todos list what the contract
 * promises; replace them with tests as you implement the use case.
 */
describe("GetExplorerBoundariesUseCase", () => {
  it("can be constructed", () => {
    const args = [] as unknown as ConstructorParameters<typeof GetExplorerBoundariesUseCase>;
    expect(new GetExplorerBoundariesUseCase(...args)).toBeInstanceOf(GetExplorerBoundariesUseCase);
  });

  it.todo(
    "Simplified boundaries to draw a map: the place itself or the places directly inside it, from the recorded geometries, resolved from the readable address. Places with no recorded boundary are counted, never drawn.",
  );
});
