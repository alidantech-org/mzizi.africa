import type { ExperienceCopyEntry } from "#sdk/types/experience/dto/copy-entry.ts";

/** Copy Catalog */
export interface ExperienceCopyCatalog {
  entries: ExperienceCopyEntry[];
  languageCode: string;
}
