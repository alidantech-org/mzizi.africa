#!/usr/bin/env bun
/** `bun run db <command>`: administration of the single Mzizi PostgreSQL database. */
import { assemble, migrate, plan, roles, status, verify } from "./commands.ts";

const USAGE = `usage: bun run db <command>

commands:
  assemble  turn the generated schema snapshot into the immutable release stream (no database access)
  status    show applied and pending releases
  plan      list pending releases and verify checksums without applying anything
  migrate   apply pending releases under an advisory lock
  verify    check applied releases against recorded checksums and the database identity
  roles     provision the engine and API roles and their grants (idempotent)

environment:
  MZIZI_DB_ADMIN_URL         administrative connection (status, plan, migrate, verify, roles)
  MZIZI_DB_ENGINE_PASSWORD   password for the mzizi_engine role (roles)
  MZIZI_DB_API_PASSWORD      password for the mzizi_api role (roles)
  MZIZI_DB_SNAPSHOT          override the generated snapshot path
  MZIZI_DB_MIGRATIONS_DIR    override the release stream directory`;

function print(output: string | string[]): void {
  console.log(Array.isArray(output) ? output.join("\n") : output);
}

async function main(argv: string[]): Promise<number> {
  const [command] = argv;
  switch (command) {
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
