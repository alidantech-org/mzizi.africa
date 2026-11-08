
import type { DomainRole } from "#/types/website/domain-role.enum.ts";
import type { PatternStatus } from "#/types/website/pattern-status.enum.ts";
import type { UrlScheme } from "#/types/website/url-scheme.enum.ts";
import type { Description } from "#/types/shared/description.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { LongText } from "#/types/shared/long-text.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DomainTemplate } from "#/types/website/domain-template.type.ts";
import type { SiteFamily } from "#/types/website/site-family.interface.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/** Domain Pattern Public */
export interface DomainPatternPublic {
  createdAt: DateTime;
  domainRole: DomainRole;
  familyId: Id;
  id: Id;
  notes?: Description | null;
  scheme: UrlScheme;
  status: PatternStatus;
  template: DomainTemplate;
  updatedAt: DateTime;
  variables: LongText;
  version: Version;
}