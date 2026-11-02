
import type { EventStatus } from "#/types/events/event-status.enum.ts";
import type { ImpactLevel } from "#/types/events/impact-level.enum.ts";
import type { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { ProvenanceMethod } from "#/types/shared/provenance-method.enum.ts";
import type { VerificationState } from "#/types/shared/verification-state.enum.ts";
import type { BusinessCode } from "#/types/shared/business-code.type.ts";
import type { Checksum } from "#/types/shared/checksum.type.ts";
import type { Confidence } from "#/types/shared/confidence.type.ts";
import type { Description } from "#/types/shared/description.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { LongText } from "#/types/shared/long-text.type.ts";
import type { Name } from "#/types/shared/name.type.ts";
import type { Url } from "#/types/shared/url.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { Jurisdiction } from "#/types/reference/jurisdiction.interface.ts";
import type { EvidencedEntity } from "#/types/shared/evidenced-entity.interface.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/** Event */
export interface Event {
  artifactChecksum?: Checksum | null;
  artifactId?: Id | null;
  code: BusinessCode;
  confidence?: Confidence | null;
  createdAt: DateTime;
  description?: LongText | null;
  endsOn?: Date | null;
  geoUnitId?: Id | null;
  id: Id;
  impactLevel?: ImpactLevel | null;
  isCurrent: Flag;
  isRecurring: Flag;
  jurisdictionId: Id;
  licence?: Name | null;
  method: ProvenanceMethod;
  retrievedAt?: DateTime | null;
  sourceName: Name;
  sourceReference?: Description | null;
  sourceUrl?: Url | null;
  startsOn: Date;
  status: EventStatus;
  title: Name;
  toolOrModel?: Name | null;
  typeId: Id;
  updatedAt: DateTime;
  validFrom?: Date | null;
  validFromPrecision?: DatePrecision | null;
  validTo?: Date | null;
  validToPrecision?: DatePrecision | null;
  verificationState: VerificationState;
  version: Version;
}