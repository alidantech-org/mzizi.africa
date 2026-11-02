
import type { ElectionStatus } from "#/types/elections/election-status.enum.ts";
import type { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { ProvenanceMethod } from "#/types/shared/provenance-method.enum.ts";
import type { VerificationState } from "#/types/shared/verification-state.enum.ts";
import type { BusinessCode } from "#/types/shared/business-code.type.ts";
import type { Checksum } from "#/types/shared/checksum.type.ts";
import type { Confidence } from "#/types/shared/confidence.type.ts";
import type { Description } from "#/types/shared/description.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Name } from "#/types/shared/name.type.ts";
import type { Url } from "#/types/shared/url.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { Jurisdiction } from "#/types/reference/jurisdiction.interface.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/** Election Public */
export interface ElectionPublic {
  administeringInstitutionId?: Id | null;
  artifactChecksum?: Checksum | null;
  artifactId?: Id | null;
  code: BusinessCode;
  confidence?: Confidence | null;
  createdAt: DateTime;
  geoUnitId?: Id | null;
  heldDate?: Date | null;
  id: Id;
  isCurrent: Flag;
  jurisdictionId: Id;
  legalBasisId?: Id | null;
  licence?: Name | null;
  method: ProvenanceMethod;
  name: Name;
  retrievedAt?: DateTime | null;
  scheduledDate?: Date | null;
  sourceName: Name;
  sourceReference?: Description | null;
  sourceUrl?: Url | null;
  status: ElectionStatus;
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