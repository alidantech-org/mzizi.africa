
import type { ChangeKind } from "#/types/geography/change-kind.enum.ts";
import type { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { ProvenanceMethod } from "#/types/shared/provenance-method.enum.ts";
import type { VerificationState } from "#/types/shared/verification-state.enum.ts";
import type { Checksum } from "#/types/shared/checksum.type.ts";
import type { Confidence } from "#/types/shared/confidence.type.ts";
import type { Description } from "#/types/shared/description.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Name } from "#/types/shared/name.type.ts";
import type { Url } from "#/types/shared/url.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { GeoUnit } from "#/types/geography/geo-unit.interface.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/** Geo Unit Change Public */
export interface GeoUnitChangePublic {
  artifactChecksum?: Checksum | null;
  artifactId?: Id | null;
  confidence?: Confidence | null;
  createdAt: DateTime;
  id: Id;
  isCurrent: Flag;
  kind: ChangeKind;
  licence?: Name | null;
  method: ProvenanceMethod;
  retrievedAt?: DateTime | null;
  sourceName: Name;
  sourceReference?: Description | null;
  sourceUnitId: Id;
  sourceUrl?: Url | null;
  targetUnitId: Id;
  toolOrModel?: Name | null;
  updatedAt: DateTime;
  validFrom?: Date | null;
  validFromPrecision?: DatePrecision | null;
  validTo?: Date | null;
  validToPrecision?: DatePrecision | null;
  verificationState: VerificationState;
  version: Version;
}