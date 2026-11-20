import { DataSource } from "typeorm";
import { describe, expect, it } from "vitest";

import { GetExplorerContextUseCase } from "#/modules/explorer/features/explorer/use-cases/get-explorer-context.usecase";

/**
 * Resolve an explicit country and registered place path or identity; incompatible identities are rejected.
 *
 * Scaffolded by Dryv once; this file belongs to the project. Behaviour is exercised by
 * test/explorer/explorer-live.spec.ts against the development API.
 */
describe("GetExplorerContextUseCase", () => {
  it("can be constructed", () => {
    const db = new DataSource({ type: "postgres", database: "unused" });
    expect(new GetExplorerContextUseCase(db)).toBeInstanceOf(GetExplorerContextUseCase);
  });
});
