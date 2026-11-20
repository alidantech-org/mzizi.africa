import { DataSource } from "typeorm";
import { describe, expect, it } from "vitest";

import { GetExplorerOverviewUseCase } from "#/modules/explorer/features/explorer/use-cases/get-explorer-overview.usecase";

/**
 * One place's context, direct children and recorded coverage counts; never substitutes demonstration measures.
 *
 * Scaffolded by Dryv once; this file belongs to the project. Behaviour is exercised by
 * test/explorer/explorer-live.spec.ts against the development API.
 */
describe("GetExplorerOverviewUseCase", () => {
  it("can be constructed", () => {
    const db = new DataSource({ type: "postgres", database: "unused" });
    expect(new GetExplorerOverviewUseCase(db)).toBeInstanceOf(GetExplorerOverviewUseCase);
  });
});
