/** Composed governance structure: legal positions, seats, powers and responsibilities from one country's records. */
import * as dryv from "@dryvcode/author";
import { sharedProperties as p, sharedFailures as failures } from "#/schemas/_shared.ts";
import { Country, Value, countryProperties } from "#/schemas/postgres/reference.ts";
import {
  Institutions,
  Positions,
  Offices,
  Procedures,
  Powers,
  Functions,
  Assignments,
} from "#/schemas/postgres/governance.ts";
import { Levels } from "#/schemas/postgres/geography.ts";
import { Entities, Names } from "#/schemas/postgres/official.ts";
import { apiHttp } from "./_shared.ts";

export const structure = dryv
  .group({ name: "structure" })
  .description("Typed country structure screen documents; formal rights are not reporting lines.");
const reads = structure.feature("Structure").failureDefaults(apiHttp);
const country = Country.asRef();
const institution = Institutions.asRef();
const position = Positions.asRef();
const office = Offices.asRef();
const value = Value.asRef();
const entity = Entities.asRef();
const name = Names.asRef();
const procedure = Procedures.asRef();
const power = Powers.asRef();
const responsibility = Functions.asRef();
const assignment = Assignments.asRef();
const level = Levels.asRef();
const Input = structure.schema("StructureInput", { countryCode: dryv.field(countryProperties.IsoAlpha2) }).asRef();
const { ReadCountryContext, ReadStructure } = reads.queries({
  ReadCountryContext: dryv.readQuery
    .from(country)
    .input(Input)
    .where((row, args) => [row.fields.isoAlpha2.eq(args.countryCode), row.fields.deletedAt.isNull()])
    .select((row) => ({
      countryId: row.fields.id,
      name: row.fields.name,
      code: row.fields.isoAlpha2,
      levels: row.reverse(level.fields.countryId, level).select(
        (l) => ({
          id: l.fields.id,
          depth: l.fields.depth,
          rootFeatureId: l.fields.rootFeatureId,
          kind: l.follow(level.fields.featureKindId, value).fields.label,
          kindCode: l.follow(level.fields.featureKindId, value).fields.code,
          routing: l.fields.isRoutingHierarchy,
        }),
        (l) => [l.fields.depth.order("asc"), l.fields.id.order("asc")],
      ),
    }))
    .orderBy((row) => [row.fields.id.order("asc")])
    .zeroOrOne(),
  ReadStructure: dryv.readQuery
    .from(country)
    .input(Input)
    .where((row, args) => [row.fields.isoAlpha2.eq(args.countryCode), row.fields.deletedAt.isNull()])
    .select((row) => ({
      countryId: row.fields.id,
      countryCode: row.fields.isoAlpha2,
      countryName: row.fields.name,
      institutions: row.reverse(institution.fields.countryId, institution).select(
        (body) => ({
          id: body.fields.id,
          code: body.fields.code,
          kind: body.follow(institution.fields.institutionKindId, value).fields.label,
          arm: body.follow(institution.fields.armId, value).fields.label,
          citationId: body.fields.sourceCitationId,
          names: body
            .follow(institution.fields.entityId, entity)
            .reverse(name.fields.entityId, name)
            .select(
              (n) => ({ name: n.fields.name, preferred: n.fields.isPreferred }),
              (n) => [n.fields.isPreferred.order("desc"), n.fields.id.order("asc")],
            ),
          positions: body.reverse(position.fields.institutionId, position).select(
            (seat) => ({
              id: seat.fields.id,
              code: seat.fields.code,
              title: seat.follow(position.fields.titleId, value).fields.label,
              role: seat.follow(position.fields.roleId, value).fields.label,
              selectionCode: seat.follow(position.fields.selectionMethodId, value).fields.code,
              selectionLabel: seat.follow(position.fields.selectionMethodId, value).fields.label,
              seatBasisCode: seat.follow(position.fields.seatBasisId, value).fields.code,
              seatBasisLabel: seat.follow(position.fields.seatBasisId, value).fields.label,
              fixedSeats: seat.fields.seatCount,
              unitLevelId: seat.fields.seatUnitLevelId,
              termYears: seat.fields.termYears,
              termLimit: seat.fields.termLimit,
              citationId: seat.fields.sourceCitationId,
              offices: seat.reverse(office.fields.positionId, office).select(
                (o) => ({
                  id: o.fields.id,
                  code: o.fields.code,
                  featureId: o.fields.unitFeatureId,
                  ordinal: o.fields.seatOrdinal,
                  abolishedOn: o.fields.abolishedOn,
                }),
                (o) => [o.fields.code.order("asc"), o.fields.id.order("asc")],
              ),
              powers: seat.reverse(power.fields.holderPositionId, power).select(
                (right) => ({
                  id: right.fields.id,
                  code: right.fields.code,
                  kind: right.follow(power.fields.kindId, value).fields.label,
                  targetPositionId: right.fields.targetPositionId,
                  targetInstitutionId: right.fields.targetInstitutionId,
                  procedureId: right.fields.procedureId,
                  step: right.fields.stepOrder,
                  binding: right.fields.isBinding,
                  citationId: right.fields.sourceCitationId,
                }),
                (right) => [right.fields.stepOrder.order("asc"), right.fields.id.order("asc")],
              ),
            }),
            (seat) => [seat.fields.displayOrder.order("asc"), seat.fields.code.order("asc"), seat.fields.id.order("asc")],
          ),
          powers: body.reverse(power.fields.holderInstitutionId, power).select(
            (right) => ({
              id: right.fields.id,
              code: right.fields.code,
              kind: right.follow(power.fields.kindId, value).fields.label,
              targetPositionId: right.fields.targetPositionId,
              targetInstitutionId: right.fields.targetInstitutionId,
              procedureId: right.fields.procedureId,
              step: right.fields.stepOrder,
              binding: right.fields.isBinding,
              citationId: right.fields.sourceCitationId,
            }),
            (right) => [right.fields.stepOrder.order("asc"), right.fields.id.order("asc")],
          ),
        }),
        (body) => [body.fields.code.order("asc"), body.fields.id.order("asc")],
      ),
      procedures: row.reverse(procedure.fields.countryId, procedure).select(
        (step) => ({
          id: step.fields.id,
          code: step.fields.code,
          kind: step.follow(procedure.fields.kindId, value).fields.label,
          description: step.fields.description,
          citationId: step.fields.sourceCitationId,
        }),
        (step) => [step.fields.code.order("asc"), step.fields.id.order("asc")],
      ),
      functions: row.reverse(responsibility.fields.countryId, responsibility).select(
        (task) => ({
          id: task.fields.id,
          code: task.fields.code,
          parentId: task.fields.parentFunctionId,
          citationId: task.fields.sourceCitationId,
          assignments: task.reverse(assignment.fields.functionId, assignment).select(
            (a) => ({
              id: a.fields.id,
              institutionId: a.fields.institutionId,
              startPositionId: a.fields.startPositionId,
              startInstitutionId: a.fields.startInstitutionId,
              share: a.follow(assignment.fields.shareId, value).fields.label,
              citationId: a.fields.sourceCitationId,
            }),
            (a) => [a.fields.code.order("asc"), a.fields.id.order("asc")],
          ),
        }),
        (task) => [task.fields.code.order("asc"), task.fields.id.order("asc")],
      ),
    }))
    .orderBy((row) => [row.fields.id.order("asc")])
    .zeroOrOne(),
});
const documents = structure.schemas({
  CountryContextDocument: dryv.schema.fromQuery(ReadCountryContext),
  StructureDocument: dryv.schema.fromQuery(ReadStructure),
});
export const structureOperations = reads.operations({
  GetCountryContext: dryv
    .operation()
    .role("detail")
    .description("Explicit country identity and recorded routing roots; no default-country inference.")
    .input(Input)
    .output(documents.CountryContextDocument)
    .queryFromInput(ReadCountryContext, { missing: failures.NotFound })
    .facets(({ input, output }) => ({
      http: dryv.http("GET", "/v1/structure/context").input(input, dryv.queryObject()).output(output),
    })),
  GetStructureScreen: dryv
    .operation()
    .role("detail")
    .description(
      "Country governance structure with typed positions, offices, powers, procedures and responsibilities. Scope is explicitly national; missing records do not establish absence.",
    )
    .input(Input)
    .output(documents.StructureDocument)
    .queryFromInput(ReadStructure, { missing: failures.NotFound })
    .facets(({ input, output }) => ({
      http: dryv.http("GET", "/v1/structure").input(input, dryv.queryObject()).output(output),
    })),
});
