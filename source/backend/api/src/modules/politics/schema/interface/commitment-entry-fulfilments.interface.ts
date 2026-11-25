import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";

/** Commitment Entry Fulfilments */
export interface CommitmentEntryFulfilments {
  appropriationId: Id | null;
  billId: Id | null;
  contractId: Id | null;
  instrumentId: Id | null;
  kindTerm: Id;
  projectId: Id | null;
  recordedOn: CalendarDate | null;
  statusTerm: Id;
}
