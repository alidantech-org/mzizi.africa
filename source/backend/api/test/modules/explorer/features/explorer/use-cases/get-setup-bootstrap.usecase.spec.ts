import { DataSource } from "typeorm";
import { describe, expect, it } from "vitest";

import { GetSetupBootstrapUseCase } from "#/modules/explorer/features/explorer/use-cases/get-setup-bootstrap.usecase";

/**
 * Country catalogue, available interface languages and recorded copy. Never chooses a default country.
 *
 * Scaffolded by Dryv once; this file belongs to the project. Behaviour is exercised by
 * test/explorer/explorer-live.spec.ts against the development API.
 */
describe("GetSetupBootstrapUseCase", () => {
  it("can be constructed", () => {
    const db = new DataSource({ type: "postgres", database: "unused" });
    expect(new GetSetupBootstrapUseCase(db)).toBeInstanceOf(GetSetupBootstrapUseCase);
  });
});
