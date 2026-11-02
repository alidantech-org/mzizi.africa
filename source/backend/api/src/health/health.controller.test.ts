import "reflect-metadata";
import { describe, expect, it } from "bun:test";
import { readOptions, writeOptions } from "../database/database.config";
import { HealthController } from "./health.controller";

describe("health", () => {
  it("reports ok", () => {
    expect(new HealthController().check().status).toBe("ok");
  });
});

describe("database config", () => {
  it("never synchronizes or runs migrations", () => {
    for (const o of [readOptions(), writeOptions()]) {
      expect(o).toMatchObject({ synchronize: false, migrationsRun: false, migrations: [] });
    }
  });
});
