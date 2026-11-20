import type { ExplorerCopyEntry } from "#sdk/types/explorer/dto/copy-entry.ts";

/** Copy Bundle */
export interface ExplorerCopyBundle {
  entries: ExplorerCopyEntry[];
  hash: string;
  language: string;
  missing: string[];
}
