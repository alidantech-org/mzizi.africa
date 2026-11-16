/** Tests for the import-boundary report: import detection and each rule. */
import { describe, expect, test } from "bun:test";
import { formatReport, importedModules, scanFile } from "./tasks/boundaries.ts";

const enginePath = "source/backend/engine/src/mzizi_engine/web/crawl/state.py";
const packageRoot = "source/packages/fetch/src/mzizi_fetch";

describe("importedModules", () => {
  test("finds from, plain, aliased, multiple and importlib imports with line numbers", () => {
    const text = [
      "from psycopg.rows import dict_row",
      "import os, json as j",
      "    import bs4",
      'client = importlib.import_module("pymongo")',
      "# import playwright",
      "text = 'import not_code here'",
    ].join("\n");
    expect(importedModules(text)).toEqual([
      { module: "psycopg.rows", line: 1 },
      { module: "os", line: 2 },
      { module: "json", line: 2 },
      { module: "bs4", line: 3 },
      { module: "pymongo", line: 4 },
    ]);
  });
});

describe("scanFile", () => {
  test("a package must not import the engine or a database driver", () => {
    const hits = scanFile(`${packageRoot}/web/client.py`, "from mzizi_engine.app import x\nimport psycopg\n", "package");
    expect(hits.map((hit) => hit.rule)).toEqual(["package-imports-engine", "package-imports-database"]);
  });
  test("the engine must not import a database driver or a capability library", () => {
    const hits = scanFile(enginePath, "import playwright.sync_api\nimport pymongo\nimport httpx\n", "engine");
    expect(hits.map((hit) => hit.rule)).toEqual(["engine-imports-capability", "engine-imports-database"]);
  });
  test("a package or engine root may hold only __init__.py", () => {
    expect(scanFile(`${packageRoot}/models.py`, "", "package").map((hit) => hit.rule)).toEqual(["package-root-module"]);
    expect(scanFile(`${packageRoot}/__init__.py`, "", "package")).toEqual([]);
    expect(scanFile("source/backend/engine/src/mzizi_engine/app.py", "", "engine").map((hit) => hit.rule)).toEqual([
      "engine-root-module",
    ]);
    expect(scanFile(enginePath, "", "engine")).toEqual([]);
  });
});

describe("formatReport", () => {
  test("lists every rule with its count and a total", () => {
    const lines = formatReport(scanFile(`${packageRoot}/models.py`, "", "package"));
    expect(lines.find((line) => line.startsWith("package-root-module: 1"))).toBeDefined();
    expect(lines.at(-1)).toBe("total: 1");
  });
});
