/** Office identity constraints are applied after the governance declarations are constructed. */
import * as dryv from "@dryvcode/author";
import { governance, Offices, Positions } from "./governance.ts";

export function applyOfficeIdentity(): void {
  /** A live seat has one identity; distinct numbered seats remain valid. */
  const liveUnnumberedUnit = governance.expression(
    "LiveUnnumberedUnitSeat",
    Offices.check((v) =>
      v.deletedAt.isNull().and(v.abolishedOn.isNull(), v.unitFeatureId.isNull().not(), v.seatOrdinal.isNull()),
    ),
  );
  const liveNumberedUnit = governance.expression(
    "LiveNumberedUnitSeat",
    Offices.check((v) =>
      v.deletedAt.isNull().and(v.abolishedOn.isNull(), v.unitFeatureId.isNull().not(), v.seatOrdinal.isNull().not()),
    ),
  );
  const liveNumbered = governance.expression(
    "LiveNumberedSeat",
    Offices.check((v) =>
      v.deletedAt.isNull().and(v.abolishedOn.isNull(), v.unitFeatureId.isNull(), v.seatOrdinal.isNull().not()),
    ),
  );
  const liveSingle = governance.expression(
    "LiveSingleSeat",
    Offices.check((v) => v.deletedAt.isNull().and(v.abolishedOn.isNull(), v.unitFeatureId.isNull(), v.seatOrdinal.isNull())),
  );
  Offices.facets({
    storage: dryv
      .storage("offices")
      .index("positionId")
      .index("institutionId")
      .index("unitFeatureId")
      .index("sourceCitationId")
      .unique("positionId", "unitFeatureId")
      .where(liveUnnumberedUnit)
      .unique("positionId", "unitFeatureId", "seatOrdinal")
      .where(liveNumberedUnit)
      .unique("positionId", "seatOrdinal")
      .where(liveNumbered)
      .unique("positionId")
      .where(liveSingle)
      .references("OfficePositionInstitution", {
        fields: ["positionId", "institutionId"],
        target: () => Positions,
        targetFields: ["id", "institutionId"],
      }),
  });
}
