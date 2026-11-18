import type { ExperienceCopyEntry } from "#sdk/types/experience/copy-entry.ts";

/** Copy Catalog */
export interface ExperienceCopyCatalog {
  entries: ExperienceCopyEntry[];
  languageCode: string;
}
