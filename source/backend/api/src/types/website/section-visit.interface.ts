
import type { Count } from "#/types/shared/count.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Url } from "#/types/shared/url.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { SectionLabel } from "#/types/website/section-label.type.ts";
import type { BaseEntity } from "#/types/shared/base-entity.interface.ts";
import type { Site } from "#/types/website/site.interface.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/** Section Visit */
export interface SectionVisit {
  createdAt: DateTime;
  depth: Count;
  id: Id;
  itemsFound: Count;
  pageUrl?: Url | null;
  ruleIndex?: Count | null;
  sectionLabel: SectionLabel;
  siteId: Id;
  structureVersionId?: Id | null;
  updatedAt: DateTime;
  version: Version;
  visitedAt: DateTime;
}