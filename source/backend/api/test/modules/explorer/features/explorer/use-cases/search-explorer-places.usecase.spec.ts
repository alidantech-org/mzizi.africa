import { DataSource } from "typeorm";
import { describe, expect, it } from "vitest";

import { SearchExplorerPlacesUseCase } from "#/modules/explorer/features/explorer/use-cases/search-explorer-places.usecase";

/**
 * Country-scoped registered places with stable pagination and canonical destinations.
 *
 * Scaffolded by Dryv once; this file belongs to the project. Behaviour is exercised by
 * test/explorer/explorer-live.spec.ts against the development API.
 */
describe("SearchExplorerPlacesUseCase", () => {
  it("can be constructed", () => {
    const db = new DataSource({ type: "postgres", database: "unused" });
    expect(new SearchExplorerPlacesUseCase(db)).toBeInstanceOf(SearchExplorerPlacesUseCase);
  });
});
