
import type { PartyStatus } from "#/types/political/party-status.enum.ts";
import type { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { MediaMarker } from "#/types/shared/media-marker.enum.ts";
import type { Abbreviation } from "#/types/political/abbreviation.type.ts";
import type { RegistryIdentifier } from "#/types/political/registry-identifier.type.ts";
import type { BusinessCode } from "#/types/shared/business-code.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Name } from "#/types/shared/name.type.ts";
import type { Url } from "#/types/shared/url.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { WikidataId } from "#/types/shared/wikidata-id.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/** Party Public */
export interface PartyPublic {
  abbreviation?: Abbreviation | null;
  code: BusinessCode;
  createdAt: DateTime;
  id: Id;
  isCurrent: Flag;
  jurisdictionId: Id;
  logoMarker?: MediaMarker | null;
  name: Name;
  registryAuthorityId?: Id | null;
  registryIdentifier?: RegistryIdentifier | null;
  status: PartyStatus;
  symbolUrl?: Url | null;
  updatedAt: DateTime;
  validFrom?: Date | null;
  validFromPrecision?: DatePrecision | null;
  validTo?: Date | null;
  validToPrecision?: DatePrecision | null;
  version: Version;
  wikidataId?: WikidataId | null;
}