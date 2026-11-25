import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { InstrumentDetailEditions } from "#/modules/legal/schema/interface/instrument-detail-editions.interface.ts";
import type { InstrumentDetailNames } from "#/modules/legal/schema/interface/instrument-detail-names.interface.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";

/** Instrument Detail */
export interface InstrumentDetail {
  code: IdentityCode;
  editions: InstrumentDetailEditions[];
  enactedOn: CalendarDate | null;
  instrumentId: Id;
  issuerId: Id | null;
  kindTerm: Id;
  names: InstrumentDetailNames[];
  publishedOn: CalendarDate | null;
  statusTerm: Id | null;
}
