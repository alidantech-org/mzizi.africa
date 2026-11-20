import { SharedDatePrecision } from "#sdk/types/shared/enums/date-precision.ts";
import { SharedSubjectTable } from "#sdk/types/shared/enums/subject-table.ts";

/** One public address segment for one subject row. Identifies a thing by a clean name under its parent; closed rows keep history so a renamed or re-parented thing redirects instead of breaking. Carries no title: titles come from the name tables. */
export interface SourceSlugs {
  canonicalSlugId?: string | null;
  code: string;
  countryId: string;
  createdAt: string;
  deletedAt?: string | null;
  fromToPrecision?: SharedDatePrecision | null;
  fromYear?: number | null;
  id: string;
  languageId?: string | null;
  namespaceId: string;
  parentSlugId?: string | null;
  slug: string;
  subjectId: string;
  subjectTable: SharedSubjectTable;
  toYear?: number | null;
  updatedAt: string;
  version: number;
}
