
import type { ContactChannel } from "#/types/contact/contact-channel.enum.ts";
import type { ContactVisibility } from "#/types/contact/contact-visibility.enum.ts";
import type { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { ContactValue } from "#/types/contact/contact-value.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Label } from "#/types/shared/label.type.ts";
import type { TargetKind } from "#/types/shared/target-kind.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { HistoricalEntity } from "#/types/shared/historical-entity.interface.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/** Contact Point */
export interface ContactPoint {
  channel: ContactChannel;
  createdAt: DateTime;
  id: Id;
  isCurrent: Flag;
  label?: Label | null;
  scopeId: Id;
  scopeKind: TargetKind;
  updatedAt: DateTime;
  validFrom?: Date | null;
  validFromPrecision?: DatePrecision | null;
  validTo?: Date | null;
  validToPrecision?: DatePrecision | null;
  value: ContactValue;
  version: Version;
  visibility: ContactVisibility;
}