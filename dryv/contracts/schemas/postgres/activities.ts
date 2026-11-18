/**
 * Schema: activities | Database: mzizi
 * What public bodies do and decide: sittings, motions, bills, budget decisions and the vote or absence of every member.
 * It serves every kind of body (legislature, county assembly, cabinet, courts) through the institution and office
 * holder links, and ties a motion to the law provision, budget or fiscal year it concerns.
 */
import * as dryv from "@dryvcode/author";
import { baseSchemas } from "#/schemas/_base.ts";
import { sharedProperties } from "#/schemas/_shared.ts";
import { BudgetVersions, FiscalPeriods } from "./finance.ts";
import { Holders, Institutions } from "./governance.ts";
import { Instruments, Provisions } from "./legal.ts";
import { Value } from "./reference.ts";
import { Citations } from "./source.ts";

const belongsTo = dryv.belongsToUsing(sharedProperties.Id);

export const activities = dryv
  .group({ name: "activities" })
  .description("Sittings, motions, votes and contributions of public bodies.")
  .facets({ storage: { namespace: "activities", store: "main" } });

/*---------------- activities.sittings ----------------*/
export const Sittings = activities
  .schema("Sittings", {
    institutionId: belongsTo(() => Institutions),
    /** Scheme act.sitting.kind: plenary, committee, cabinet meeting, bench, county assembly sitting. */
    sittingKindId: belongsTo(() => Value),
    title: dryv.field(sharedProperties.Name),
    heldOn: dryv.field(sharedProperties.CalendarDate),
    sourceCitationId: belongsTo(() => Citations).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .description("One meeting of a public body on one day.")
  .role("entity")
  .facets({ storage: dryv.storage("sittings").index("institutionId", "heldOn").index("sourceCitationId") });

/*---------------- activities.motions ----------------*/
export const Motions = activities
  .schema("Motions", {
    sittingId: belongsTo(() => Sittings),
    /** Scheme act.motion.kind: bill, motion, budget estimate, appointment, resolution, judgment, executive decision. */
    motionKindId: belongsTo(() => Value),
    /** Scheme act.motion.outcome: passed, rejected, withdrawn, deferred, pending. */
    outcomeId: belongsTo(() => Value),
    title: dryv.field(sharedProperties.Name),
    summary: dryv.field(sharedProperties.Description).maybe(),
    movedByHolderId: belongsTo(() => Holders).maybe(),
    instrumentId: belongsTo(() => Instruments).maybe(),
    provisionId: belongsTo(() => Provisions).maybe(),
    budgetVersionId: belongsTo(() => BudgetVersions).maybe(),
    fiscalPeriodId: belongsTo(() => FiscalPeriods).maybe(),
    sourceCitationId: belongsTo(() => Citations).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .description("One matter put to a sitting: a bill, motion, budget decision or other resolution, with its outcome.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("motions")
      .index("sittingId")
      .index("instrumentId")
      .index("provisionId")
      .index("budgetVersionId")
      .index("fiscalPeriodId")
      .index("sourceCitationId"),
  });

/*---------------- activities.votes ----------------*/
export const Votes = activities
  .schema("Votes", {
    motionId: belongsTo(() => Motions),
    holderId: belongsTo(() => Holders),
    /** Scheme act.vote.position: yes, no, abstain, absent. */
    positionId: belongsTo(() => Value),
    sourceCitationId: belongsTo(() => Citations).maybe(),
  })
  .extends(baseSchemas.Entity)
  .description("One office holder's recorded position on one motion, including being absent.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("votes")
      .unique("motionId", "holderId")
      .index("holderId")
      .index("positionId")
      .index("sourceCitationId"),
  });

/*---------------- activities.contributions ----------------*/
export const Contributions = activities
  .schema("Contributions", {
    sittingId: belongsTo(() => Sittings),
    holderId: belongsTo(() => Holders),
    motionId: belongsTo(() => Motions).maybe(),
    /** Scheme act.contribution.kind: speech, question, statement, petition. */
    contributionKindId: belongsTo(() => Value),
    summary: dryv.field(sharedProperties.Description).maybe(),
    wordCount: dryv.field(sharedProperties.NonNegativeInteger).maybe(),
    sourceCitationId: belongsTo(() => Citations).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .description("One member's speech, question or statement at a sitting.")
  .role("entity")
  .facets({
    storage: dryv.storage("contributions").index("sittingId").index("holderId").index("motionId").index("sourceCitationId"),
  });
