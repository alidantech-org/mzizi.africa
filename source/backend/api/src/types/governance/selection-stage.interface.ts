
import type { StageKind } from "#/types/governance/stage-kind.enum.ts";
import type { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { StageOrder } from "#/types/governance/stage-order.type.ts";
import type { Description } from "#/types/shared/description.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { SelectionProcedure } from "#/types/governance/selection-procedure.interface.ts";
import type { HistoricalEntity } from "#/types/shared/historical-entity.interface.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/** Selection Stage */
export interface SelectionStage {
  actorInstitutionId?: Id | null;
  actorOfficeId?: Id | null;
  createdAt: DateTime;
  description?: Description | null;
  id: Id;
  isCurrent: Flag;
  kind: StageKind;
  procedureId: Id;
  stageOrder: StageOrder;
  updatedAt: DateTime;
  validFrom?: Date | null;
  validFromPrecision?: DatePrecision | null;
  validTo?: Date | null;
  validToPrecision?: DatePrecision | null;
  version: Version;
}