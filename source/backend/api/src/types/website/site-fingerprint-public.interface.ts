
import type { FingerprintKind } from "#/types/website/fingerprint-kind.enum.ts";
import type { Checksum } from "#/types/shared/checksum.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { LongText } from "#/types/shared/long-text.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { Site } from "#/types/website/site.interface.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/** Site Fingerprint Public */
export interface SiteFingerprintPublic {
  checkId?: Id | null;
  computedAt: DateTime;
  createdAt: DateTime;
  digest: Checksum;
  features: LongText;
  id: Id;
  kind: FingerprintKind;
  siteId: Id;
  updatedAt: DateTime;
  version: Version;
}