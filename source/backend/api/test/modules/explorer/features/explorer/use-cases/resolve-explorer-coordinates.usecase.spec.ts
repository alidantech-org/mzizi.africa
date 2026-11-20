import { DataSource } from "typeorm";
import { describe, expect, it } from "vitest";

import { ResolveExplorerCoordinatesUseCase } from "#/modules/explorer/features/explorer/use-cases/resolve-explorer-coordinates.usecase";

/**
 * Read geographic candidates from recorded boundaries. POST keeps device coordinates out of shared query strings; it performs no writes.
 *
 * Scaffolded by Dryv once; this file belongs to the project. Behaviour is exercised by
 * test/explorer/explorer-live.spec.ts against the development API.
 */
describe("ResolveExplorerCoordinatesUseCase", () => {
  it("can be constructed", () => {
    const db = new DataSource({ type: "postgres", database: "unused" });
    expect(new ResolveExplorerCoordinatesUseCase(db)).toBeInstanceOf(
      ResolveExplorerCoordinatesUseCase,
    );
  });
});
