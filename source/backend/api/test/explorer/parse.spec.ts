/** Database results must satisfy generated contracts before reaching explorer consumers. */
import "reflect-metadata";
import { describe, expect, it, vi } from "vitest";
import { DataSource } from "typeorm";
import { CountDto } from "#/modules/explorer/schema/dto/count.dto";
import { queryRows } from "#/modules/explorer/features/explorer/reads/parse.ts";

describe("explorer row parsing boundary", () => {
  it("returns generated validated DTO instances", async () => {
    const db = new DataSource({ type: "postgres", database: "unused" });
    vi.spyOn(db, "query").mockResolvedValue([{ label: "Recorded records", value: 3 }]);
    const rows = await queryRows(db, "unused", [], CountDto);
    expect(rows[0]).toBeInstanceOf(CountDto);
    expect(rows[0]?.value).toBe(3);
  });
  it("rejects fields outside the declared response", async () => {
    const db = new DataSource({ type: "postgres", database: "unused" });
    vi.spyOn(db, "query").mockResolvedValue([
      { label: "Recorded records", value: 3, invented: true },
    ]);
    await expect(queryRows(db, "unused", [], CountDto)).rejects.toThrow("declared contract");
  });
  it("rejects impossible counts instead of coercing them", async () => {
    const db = new DataSource({ type: "postgres", database: "unused" });
    vi.spyOn(db, "query").mockResolvedValue([{ label: "Recorded records", value: -1 }]);
    await expect(queryRows(db, "unused", [], CountDto)).rejects.toThrow("declared contract");
  });
  it("rejects scalar rows", async () => {
    const db = new DataSource({ type: "postgres", database: "unused" });
    vi.spyOn(db, "query").mockResolvedValue(["untyped"]);
    await expect(queryRows(db, "unused", [], CountDto)).rejects.toThrow("invalid row");
  });
  it("rejects a non-row result", async () => {
    const db = new DataSource({ type: "postgres", database: "unused" });
    vi.spyOn(db, "query").mockResolvedValue(null);
    await expect(queryRows(db, "unused", [], CountDto)).rejects.toThrow("did not return rows");
  });
});
