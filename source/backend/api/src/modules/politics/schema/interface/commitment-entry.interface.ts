import type { CommitmentKind } from "#/modules/politics/schema/enum/commitment-kind.enum.ts";
import type { Statement } from "#/modules/politics/schema/type/statement.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { CommitmentEntryFulfilments } from "#/modules/politics/schema/interface/commitment-entry-fulfilments.interface.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";

/** Commitment Entry */
export interface CommitmentEntry {
  code: IdentityCode;
  commitmentId: Id;
  dueOn: CalendarDate | null;
  fulfilments: CommitmentEntryFulfilments[];
  kind: CommitmentKind;
  languageCode: IdentityCode;
  madeOn: CalendarDate | null;
  placeId: Id | null;
  quantity: Number | null;
  statement: Statement;
  statusAsOf: CalendarDate | null;
  statusTerm: Id;
  topicTerm: Id | null;
}
