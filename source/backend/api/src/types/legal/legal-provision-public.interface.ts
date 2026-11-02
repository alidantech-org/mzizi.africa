
import type { ProvisionKind } from "#/types/legal/provision-kind.enum.ts";
import type { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { ProvenanceMethod } from "#/types/shared/provenance-method.enum.ts";
import type { VerificationState } from "#/types/shared/verification-state.enum.ts";
import type { Citation } from "#/types/legal/citation.type.ts";
import type { BusinessCode } from "#/types/shared/business-code.type.ts";
import type { Checksum } from "#/types/shared/checksum.type.ts";
import type { Confidence } from "#/types/shared/confidence.type.ts";
import type { Count } from "#/types/shared/count.type.ts";
import type { Description } from "#/types/shared/description.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { LongText } from "#/types/shared/long-text.type.ts";
import type { Name } from "#/types/shared/name.type.ts";
import type { Url } from "#/types/shared/url.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { LegalInstrument } from "#/types/legal/legal-instrument.interface.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/** Legal Provision Public */
export interface LegalProvisionPublic {
  artifactChecksum?: Checksum | null;
  artifactId?: Id | null;
  citation: Citation;
  code: BusinessCode;
  confidence?: Confidence | null;
  content?: LongText | null;
  createdAt: DateTime;
  heading?: Name | null;
  id: Id;
  instrumentId: Id;
  isCurrent: Flag;
  kind: ProvisionKind;
  licence?: Name | null;
  method: ProvenanceMethod;
  parentId?: Id | null;
  previousVersionId?: Id | null;
  retrievedAt?: DateTime | null;
  sortOrder: Count;
  sourceName: Name;
  sourceReference?: Description | null;
  sourceUrl?: Url | null;
  toolOrModel?: Name | null;
  updatedAt: DateTime;
  validFrom?: Date | null;
  validFromPrecision?: DatePrecision | null;
  validTo?: Date | null;
  validToPrecision?: DatePrecision | null;
  verificationState: VerificationState;
  version: Version;
}