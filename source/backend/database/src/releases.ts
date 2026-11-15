/** Release files on disk: loading, checksums and assembling the generated snapshot into the stream. */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SNAPSHOT_MARKER = ".snapshot";
const INITIAL_RELEASE = "0001_init.sql";

export interface Release {
  readonly name: string;
  readonly sql: string;
  readonly checksum: string;
}

export type Assembled = "initial" | "up-to-date";

export function checksum(sql: string): string {
  return createHash("sha256").update(sql, "utf8").digest("hex");
}

/** Loads ordered releases (`*.sql`) from a stream directory. A missing directory is an empty stream. */
export function loadReleases(dir: string): Release[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((file) => file.endsWith(".sql"))
    .sort()
    .map((file) => {
      const sql = readFileSync(join(dir, file), "utf8");
      return { name: file.slice(0, -".sql".length), sql, checksum: checksum(sql) };
    });
}

/**
 * Turns the generated snapshot into the immutable stream.
 * An empty stream receives `0001_init.sql` and a `.snapshot` checksum record. A non-empty stream must
 * still match the recorded checksum: a changed snapshot is refused because releases are immutable and
 * schema-evolution releases are not generated yet.
 */
export function assemble(snapshotPath: string, streamDir: string): Assembled {
  if (!existsSync(snapshotPath)) {
    throw new Error(`cannot read schema snapshot ${snapshotPath}; run \`bun run dryv:database:generate\` first`);
  }
  const sql = readFileSync(snapshotPath, "utf8");
  const digest = checksum(sql);
  mkdirSync(streamDir, { recursive: true });
  const marker = join(streamDir, SNAPSHOT_MARKER);
  const hasReleases = readdirSync(streamDir).some((file) => file.endsWith(".sql"));

  if (!hasReleases) {
    writeFileSync(join(streamDir, INITIAL_RELEASE), sql);
    writeFileSync(marker, `${digest}\n`);
    return "initial";
  }
  if (!existsSync(marker)) {
    throw new Error(`${streamDir} holds releases but no ${SNAPSHOT_MARKER} record; restore it from version control`);
  }
  if (readFileSync(marker, "utf8").trim() === digest) return "up-to-date";
  throw new Error(
    `the generated schema snapshot changed after ${streamDir} was assembled; releases are immutable and ` +
      "schema-evolution releases are not supported yet. Revert the contract change, or start a fresh stream deliberately",
  );
}
