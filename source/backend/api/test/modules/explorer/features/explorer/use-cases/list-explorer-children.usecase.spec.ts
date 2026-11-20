import { DataSource } from "typeorm";
import { describe, expect, it } from "vitest";

import { ListExplorerChildrenUseCase } from "#/modules/explorer/features/explorer/use-cases/list-explorer-children.usecase";

/**
 * Direct children in the recorded routing hierarchy of one explicit country.
 *
 * Scaffolded by Dryv once; this file belongs to the project. Behaviour is exercised by
 * test/explorer/explorer-live.spec.ts against the development API.
 */
describe("ListExplorerChildrenUseCase", () => {
  it("can be constructed", () => {
    const db = new DataSource({ type: "postgres", database: "unused" });
    expect(new ListExplorerChildrenUseCase(db)).toBeInstanceOf(ListExplorerChildrenUseCase);
  });
});
