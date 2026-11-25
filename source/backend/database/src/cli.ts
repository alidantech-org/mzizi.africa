#!/usr/bin/env bun
/** `bun run db <command>`: administration of the single Mzizi PostgreSQL database. */
import { assemble, migrate, partitions, plan, refresh, roles, status, verify } from "./commands.ts";
import { paths } from "./config.ts";
import { formatFile } from "./format.ts";

const USAGE = `usage: bun run db <command>

commands:
  format    format generated SQL in place; format [--check] [file...] (default: the snapshot; no database access)
  assemble  turn the generated schema snapshot into the immutable release stream (no database access)
  status    show applied and pending releases
  plan      list pending releases and verify checksums without applying anything
  migrate   apply pending releases under an advisory lock
  verify    check applied releases against recorded checksums and the database identity
  roles     provision the engine and API roles and their grants (idempotent)
  refresh   rebuild prepared tables: refresh [outlines|pieces|figures...] (default: all)
  partitions  add missing monthly partitions: partitions [--through YYYY-MM] (default: 12 months ahead)

environment:
  MZIZI_DB_ADMIN_URL         administrative connection (status, plan, migrate, verify, roles)
  MZIZI_DB_ENGINE_PASSWORD   password for the mzizi_engine role (roles)
  MZIZI_DB_API_PASSWORD      password for the mzizi_api role (roles)
  MZIZI_DB_SNAPSHOT          override the generated snapshot path
  MZIZI_DB_MIGRATIONS_DIR    override the release stream directory`;

function print(output: string | string[]): void {
  console.log(Array.isArray(output) ? output.join("\n") : output);
}

function format(args: string[]): number {
  const check = args.includes("--check");
  const files = args.filter((arg) => !arg.startsWith("--"));
  const targets = files.length > 0 ? files : [paths().snapshot];
  const changed = targets.map((file) => formatFile(file, check)).filter((result) => result.changed);
  for (const result of changed) console.log(`${check ? "needs formatting" : "formatted"}: ${result.path}`);
  return check && changed.length > 0 ? 1 : 0;
}

async function main(argv: string[]): Promise<number> {
  const [command] = argv;
  switch (command) {
    case "format":
      return format(argv.slice(1));
    case "assemble":
      print(assemble());
      return 0;
    case "status":
      print(await status());
      return 0;
    case "plan":
      print(await plan());
      return 0;
    case "migrate":
      print(await migrate());
      return 0;
    case "verify":
      print(await verify());
      return 0;
    case "roles":
      print(await roles());
      return 0;
    case "refresh":
      print(await refresh(argv.slice(1)));
      return 0;
    case "partitions": {
      const at = argv.indexOf("--through");
      print(await partitions(at >= 0 ? argv[at + 1] : undefined));
      return 0;
    }
    case undefined:
    case "help":
    case "--help":
      print(USAGE);
      return 0;
    default:
      console.error(`unknown command: ${command}\n\n${USAGE}`);
      return 2;
  }
}

try {
  process.exit(await main(process.argv.slice(2)));
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
