/** Tests for the root runner: argument parsing, project selection, step planning and the structure rules. */
import { describe, expect, test } from "bun:test";
import { failures, runBounded } from "./lib/exec.ts";
import { parseEnv } from "./lib/paths.ts";
import { portOf, projects, select, services } from "./lib/projects.ts";
import { commands, parse } from "./mz.ts";
import { qualitySteps } from "./tasks/quality.ts";
import { pick } from "./tasks/serve.ts";
import { fileProblems, hasHeader, type Limit, lineCount } from "./tasks/structure.ts";
import packageJson from "../package.json" with { type: "json" };

describe("parse", () => {
  test("defaults to help", () => {
    expect(parse([]).command).toBe("help");
  });
  test("keeps positional arguments and extracts --only in both forms", () => {
    expect(parse(["dev", "api", "web"]).context).toEqual({ rest: ["api", "web"], only: undefined });
    expect(parse(["test", "--only", "python", "-x"]).context).toEqual({ rest: ["-x"], only: "python" });
    expect(parse(["test", "--only=api,web"]).context).toEqual({ rest: [], only: "api,web" });
  });
});

describe("package.json", () => {
  test("every script calls a command that exists", () => {
    for (const [name, script] of Object.entries(packageJson.scripts)) {
      const command = script.replace("bun scripts/mz.ts", "").trim().split(" ")[0];
      if (name === "mz") continue;
      expect(command === "help" || Object.hasOwn(commands, command ?? ""), `${name} -> ${command}`).toBe(true);
    }
  });
});

describe("select", () => {
  test("default set leaves out opt-in projects", () => {
    expect(select().map((project) => project.name)).not.toContain("mobile");
  });
  test("names, kinds and all", () => {
    expect(select("api,web").map((project) => project.name)).toEqual(["api", "web"]);
    expect(select("python").map((project) => project.name)).toEqual(["python"]);
    expect(select("all")).toHaveLength(projects.length);
    expect(select("mobile").map((project) => project.name)).toEqual(["mobile"]);
  });
  test("unknown names are an error", () => {
    expect(() => select("nope")).toThrow("unknown project");
  });
});

describe("steps", () => {
  test("Python is checked with uv and never with a bare interpreter", () => {
    for (const kind of ["format", "lint", "typecheck", "test", "build"] as const) {
      for (const item of qualitySteps(kind, select("python"))) expect(item.args[0]).toBe("uv");
    }
  });
  test("JavaScript and TypeScript projects are run with bun", () => {
    for (const item of qualitySteps("typecheck", select("bun"))) expect(item.args[0]).toBe("bun");
  });
  test("services have distinct ports and unknown services are an error", () => {
    expect(new Set(services.map((service) => service.port)).size).toBe(services.length);
    expect(pick([]).length).toBe(services.length);
    const api = pick(["api"])[0];
    if (!api) throw new Error("api service missing");
    expect(portOf(api, { API_PORT: "3900" })).toBe(3900);
    expect(portOf(api, { API_PORT: "x" })).toBe(3000);
    expect(pick(["api"]).map((service) => service.name)).toEqual(["api"]);
    expect(() => pick(["nope"])).toThrow("unknown service");
  });
  test("TypeScript services use Bun for development and production entrypoints", () => {
    for (const service of services.filter(({ name }) => name !== "engine")) {
      expect(service.dev[0]).toBe("bun");
      expect(service.start[0]).toBe("bun");
    }
  });
});

describe("exec", () => {
  test("failures lists non-zero results", () => {
    expect(
      failures([
        { name: "a", code: 0 },
        { name: "b", code: 2 },
      ]),
    ).toEqual(["b"]);
  });
  test("runBounded never exceeds its concurrency", async () => {
    let running = 0;
    let peak = 0;
    await runBounded([1, 2, 3, 4, 5], 2, async () => {
      peak = Math.max(peak, ++running);
      await Bun.sleep(5);
      running--;
    });
    expect(peak).toBe(2);
  });
});

describe("parseEnv", () => {
  test("handles comments, export and quotes", () => {
    expect(parseEnv('# note\nexport A=1\nB="two words"\nC=x=y\n\nbad line')).toEqual({ A: "1", B: "two words", C: "x=y" });
  });
});

describe("structure", () => {
  const limit: Limit = { dir: "x", match: /\.py$/, lines: 3, needsHeader: true };
  test("counts lines without the trailing newline", () => {
    expect(lineCount("a\nb\n")).toBe(2);
    expect(lineCount("")).toBe(0);
  });
  test("recognizes docstrings and leading comments", () => {
    expect(hasHeader("a.py", '"""Doc."""\nx = 1\n')).toBe(true);
    expect(hasHeader("a.py", "import os\n")).toBe(false);
    expect(hasHeader("a.ts", "#!/usr/bin/env bun\n/** Doc. */\n")).toBe(true);
    expect(hasHeader("a.ts", "import x from 'y';\n")).toBe(false);
  });
  test("reports oversized files and missing headers", () => {
    expect(fileProblems("/r/a.py", '"""Doc."""\n', limit)).toEqual([]);
    expect(fileProblems("/r/a.py", "a\nb\nc\nd\n", limit)).toHaveLength(2);
  });
});
