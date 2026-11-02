
import type { RuleKind } from "#/types/governance/rule-kind.enum.ts";
import type { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { ProvenanceMethod } from "#/types/shared/provenance-method.enum.ts";
import type { VerificationState } from "#/types/shared/verification-state.enum.ts";
import type { RuleValue } from "#/types/governance/rule-value.type.ts";
import type { Checksum } from "#/types/shared/checksum.type.ts";
import type { Confidence } from "#/types/shared/confidence.type.ts";
import type { Description } from "#/types/shared/description.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Name } from "#/types/shared/name.type.ts";
import type { Url } from "#/types/shared/url.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { Office } from "#/types/governance/office.interface.ts";
import type { EvidencedEntity } from "#/types/shared/evidenced-entity.interface.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/** Office Rule */
export interface OfficeRule {
  artifactChecksum?: Checksum | null;
  artifactId?: Id | null;
  confidence?: Confidence | null;
  createdAt: DateTime;
  id: Id;
  isCurrent: Flag;
  kind: RuleKind;
  legalBasisId?: Id | null;
  licence?: Name | null;
  method: ProvenanceMethod;
  numericValue?: RuleValue | null;
  officeId: Id;
  retrievedAt?: DateTime | null;
  sourceName: Name;
  sourceReference?: Description | null;
  sourceUrl?: Url | null;
  textValue?: Description | null;
  toolOrModel?: Name | null;
  updatedAt: DateTime;
  validFrom?: Date | null;
  validFromPrecision?: DatePrecision | null;
  validTo?: Date | null;
  validToPrecision?: DatePrecision | null;
  verificationState: VerificationState;
  version: Version;
}