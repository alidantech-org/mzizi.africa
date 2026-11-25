/**
 * Module `governance`: institutions, offices and who holds them, how they relate, and the powers between them.
 */
import * as dryv from "@dryvcode/author";
import { sharedFailures as f, sharedProperties as p } from "#/schemas/_shared.ts";
import {
  Appointments,
  governance,
  Holders,
  Institutions,
  Offices,
  Positions,
  Powers,
  Relationships,
} from "#/schemas/postgres/governance.ts";
import { Individuals } from "#/schemas/postgres/official.ts";
import { apiHttp, CACHE, identityRef, MAX_PAGE, namesOf, PageWindow } from "./_shared.ts";

const bodies = governance.feature("Bodies").failureDefaults(apiHttp);
const seats = governance.feature("Seats").failureDefaults(apiHttp);
const institution = Institutions.asRef();
const position = Positions.asRef();
const office = Offices.asRef();
const holder = Holders.asRef();
const appointment = Appointments.asRef();
const relationship = Relationships.asRef();
const power = Powers.asRef();
const individual = Individuals.asRef();

const InstitutionKey = governance.schema("InstitutionKey", { code: dryv.field(p.IdentityCode) }).asRef();
const InstitutionWindow = governance
  .schema("InstitutionWindow", { countryId: dryv.field(p.Id), armTerm: dryv.field(p.Id).optional() })
  .extends(PageWindow)
  .asRef();
const PlaceOffices = governance
  .schema("PlaceOffices", { featureId: dryv.field(p.Id) })
  .extends(PageWindow)
  .asRef();
const OfficeKey = governance.schema("OfficeKey", { code: dryv.field(p.IdentityCode) }).asRef();
const IdentityScope = governance
  .schema("GovernanceIdentityScope", { identityId: dryv.field(p.Id) })
  .extends(PageWindow)
  .asRef();

const holderSelect = (h: dryv.QueryRow<typeof holder extends dryv.SchemaRef<infer F> ? F : never>) => ({
  holderId: h.fields.id,
  individualId: h.fields.individualId,
  individualCode: h.follow(holder.fields.individualId, individual).fields.code,
  methodTerm: h.fields.methodTerm,
  fromYear: h.fields.fromYear,
  toYear: h.fields.toYear,
  startsOn: h.fields.startsOn,
  endsOn: h.fields.endsOn,
  names: namesOf(h.follow(holder.fields.individualId, individual).follow(individual.fields.id, identityRef)),
});

const q = {
  ...bodies.queries({
    ScanInstitutions: dryv.readQuery
      .from(institution)
      .input(InstitutionWindow)
      .where((row, args) => [row.fields.countryId.eq(args.countryId), row.fields.armTerm.eq(args.armTerm)])
      .select((row) => ({
        institutionId: row.fields.id,
        code: row.fields.code,
        kindTerm: row.fields.kindTerm,
        classTerm: row.fields.classTerm,
        armTerm: row.fields.armTerm,
        fromYear: row.fields.fromYear,
        toYear: row.fields.toYear,
        names: namesOf(row.follow(institution.fields.id, identityRef)),
      }))
      .orderBy((row) => [row.fields.code.order("asc"), row.fields.id.order("asc")])
      .page(({ limit, offset }) => ({ limit, offset, maxLimit: MAX_PAGE })),
    FindInstitution: dryv.readQuery
      .from(institution)
      .input(InstitutionKey)
      .where((row, args) => [row.fields.code.eq(args.code)])
      .select((row) => ({
        institutionId: row.fields.id,
        code: row.fields.code,
        kindTerm: row.fields.kindTerm,
        classTerm: row.fields.classTerm,
        armTerm: row.fields.armTerm,
        basisTerm: row.fields.basisTerm,
        countryId: row.fields.countryId,
        fromYear: row.fields.fromYear,
        toYear: row.fields.toYear,
        names: namesOf(row.follow(institution.fields.id, identityRef)),
        offices: row.reverse(office.fields.institutionId, office).select(
          (o) => ({
            officeId: o.fields.id,
            code: o.fields.code,
            featureId: o.fields.featureId,
            seat: o.fields.seat,
            roleTerm: o.follow(office.fields.positionId, position).fields.roleTerm,
            order: o.follow(office.fields.positionId, position).fields.position,
            names: namesOf(o.follow(office.fields.id, identityRef)),
            holders: o
              .reverse(holder.fields.officeId, holder)
              .select(holderSelect, (h) => [h.fields.fromYear.order("desc"), h.fields.id.order("asc")]),
          }),
          (o) => [o.fields.code.order("asc"), o.fields.id.order("asc")],
        ),
      }))
      .orderBy((row) => [row.fields.id.order("asc")])
      .zeroOrOne(),
    ScanRelationships: dryv.readQuery
      .from(relationship)
      .input(IdentityScope)
      .where((row, args) => [row.fields.toId.eq(args.identityId)])
      .select((row) => ({
        fromId: row.fields.fromId,
        fromCode: row.follow(relationship.fields.fromId, identityRef).fields.code,
        kindTerm: row.fields.kindTerm,
        fromYear: row.fields.fromYear,
        toYear: row.fields.toYear,
        names: namesOf(row.follow(relationship.fields.fromId, identityRef)),
      }))
      .orderBy((row) => [row.fields.fromId.order("asc"), row.fields.id.order("asc")])
      .page(({ limit, offset }) => ({ limit, offset, maxLimit: MAX_PAGE })),
    ScanPowers: dryv.readQuery
      .from(power)
      .input(IdentityScope)
      .where((row, args) => [row.fields.fromId.eq(args.identityId)])
      .select((row) => ({
        powerId: row.fields.id,
        toId: row.fields.toId,
        toCode: row.follow(power.fields.toId, identityRef).fields.code,
        kindTerm: row.fields.kindTerm,
        thresholdTerm: row.fields.thresholdTerm,
        isBinding: row.fields.isBinding,
        provisionId: row.fields.provisionId,
        toNames: namesOf(row.follow(power.fields.toId, identityRef)),
      }))
      .orderBy((row) => [row.fields.kindTerm.order("asc"), row.fields.id.order("asc")])
      .page(({ limit, offset }) => ({ limit, offset, maxLimit: MAX_PAGE })),
  }),
  ...seats.queries({
    ScanPlaceOffices: dryv.readQuery
      .from(office)
      .input(PlaceOffices)
      .where((row, args) => [row.fields.featureId.eq(args.featureId), row.fields.toYear.isNull()])
      .select((row) => ({
        officeId: row.fields.id,
        code: row.fields.code,
        seat: row.fields.seat,
        institutionId: row.fields.institutionId,
        institutionCode: row.follow(office.fields.institutionId, institution).fields.code,
        roleTerm: row.follow(office.fields.positionId, position).fields.roleTerm,
        methodTerm: row.follow(office.fields.positionId, position).fields.methodTerm,
        order: row.follow(office.fields.positionId, position).fields.position,
        names: namesOf(row.follow(office.fields.id, identityRef)),
        holders: row
          .reverse(holder.fields.officeId, holder)
          .select(holderSelect, (h) => [h.fields.fromYear.order("desc"), h.fields.id.order("asc")]),
      }))
      .orderBy((row) => [row.fields.code.order("asc"), row.fields.id.order("asc")])
      .page(({ limit, offset }) => ({ limit, offset, maxLimit: MAX_PAGE })),
    FindOffice: dryv.readQuery
      .from(office)
      .input(OfficeKey)
      .where((row, args) => [row.fields.code.eq(args.code)])
      .select((row) => ({
        officeId: row.fields.id,
        code: row.fields.code,
        seat: row.fields.seat,
        featureId: row.fields.featureId,
        institutionId: row.fields.institutionId,
        positionId: row.fields.positionId,
        roleTerm: row.follow(office.fields.positionId, position).fields.roleTerm,
        termYears: row.follow(office.fields.positionId, position).fields.termYears,
        termLimit: row.follow(office.fields.positionId, position).fields.termLimit,
        names: namesOf(row.follow(office.fields.id, identityRef)),
        holders: row.reverse(holder.fields.officeId, holder).select(
          (h) => ({
            ...holderSelect(h),
            steps: h.reverse(appointment.fields.holderId, appointment).select(
              (a) => ({
                step: a.fields.step,
                actorId: a.fields.actorId,
                actorCode: a.follow(appointment.fields.actorId, identityRef).fields.code,
                actorHolderId: a.fields.actorHolderId,
                motionId: a.fields.motionId,
                onDate: a.fields.onDate,
              }),
              (a) => [a.fields.onDate.order("asc"), a.fields.id.order("asc")],
            ),
          }),
          (h) => [h.fields.fromYear.order("desc"), h.fields.id.order("asc")],
        ),
      }))
      .orderBy((row) => [row.fields.id.order("asc")])
      .zeroOrOne(),
  }),
};
export const governanceQueries = q;
const rows = governance.schemas({
  InstitutionEntry: dryv.schema.fromQuery(q.ScanInstitutions),
  InstitutionDetail: dryv.schema.fromQuery(q.FindInstitution),
  RelationshipEntry: dryv.schema.fromQuery(q.ScanRelationships),
  PowerEntry: dryv.schema.fromQuery(q.ScanPowers),
  OfficeEntry: dryv.schema.fromQuery(q.ScanPlaceOffices),
  OfficeDetail: dryv.schema.fromQuery(q.FindOffice),
});
export const governanceRows = rows;
const io = governance.schemas({
  InstitutionCollection: dryv.schema({ institutions: dryv.field(rows.InstitutionEntry).array() }),
  RelationshipCollection: dryv.schema({ relationships: dryv.field(rows.RelationshipEntry).array() }),
  PowerCollection: dryv.schema({ powers: dryv.field(rows.PowerEntry).array() }),
  OfficeCollection: dryv.schema({ offices: dryv.field(rows.OfficeEntry).array() }),
});

export const governanceOperations = {
  ...bodies.operations({
    ListInstitutions: dryv
      .operation()
      .role("list")
      .description("A country's public institutions, optionally of one arm.")
      .input(InstitutionWindow)
      .output(io.InstitutionCollection)
      .queryFromInput(q.ScanInstitutions, { envelope: { institutions: "rows" } })
      .cache(CACHE.structure)
      .facets(({ input, output }) => ({
        http: dryv.http("GET", "/v1/governance/institutions").input(input, dryv.queryObject()).output(output),
      })),
    GetInstitution: dryv
      .operation()
      .role("detail")
      .description("One institution with its offices and their holders: the leadership tree.")
      .input(InstitutionKey)
      .output(rows.InstitutionDetail)
      .queryFromInput(q.FindInstitution, { missing: f.NotFound })
      .cache(CACHE.structure)
      .facets(({ inputField, output }) => ({
        http: dryv.http("GET", "/v1/governance/institutions/{code}").input(inputField("code"), dryv.path()).output(output),
      })),
    ListMembers: dryv
      .operation()
      .role("list")
      .description("What sits under or reports to an institution, position or office (part of, oversees, accountable to).")
      .input(IdentityScope)
      .output(io.RelationshipCollection)
      .queryFromInput(q.ScanRelationships, { envelope: { relationships: "rows" } })
      .cache(CACHE.structure)
      .facets(({ input, output }) => ({
        http: dryv.http("GET", "/v1/governance/members").input(input, dryv.queryObject()).output(output),
      })),
    ListPowers: dryv
      .operation()
      .role("list")
      .description("The powers a position or institution holds over others (appoint, dismiss, veto, approve).")
      .input(IdentityScope)
      .output(io.PowerCollection)
      .queryFromInput(q.ScanPowers, { envelope: { powers: "rows" } })
      .cache(CACHE.structure)
      .facets(({ input, output }) => ({
        http: dryv.http("GET", "/v1/governance/powers").input(input, dryv.queryObject()).output(output),
      })),
  }),
  ...seats.operations({
    ListPlaceOffices: dryv
      .operation()
      .role("list")
      .description("The current offices for a place (governor, MCAs) with who holds them.")
      .input(PlaceOffices)
      .output(io.OfficeCollection)
      .queryFromInput(q.ScanPlaceOffices, { envelope: { offices: "rows" } })
      .cache(CACHE.structure)
      .facets(({ input, output }) => ({
        http: dryv.http("GET", "/v1/governance/offices").input(input, dryv.queryObject()).output(output),
      })),
    GetOffice: dryv
      .operation()
      .role("detail")
      .description("One office with every holder and the steps that put each in office.")
      .input(OfficeKey)
      .output(rows.OfficeDetail)
      .queryFromInput(q.FindOffice, { missing: f.NotFound })
      .cache(CACHE.structure)
      .facets(({ inputField, output }) => ({
        http: dryv.http("GET", "/v1/governance/offices/{code}").input(inputField("code"), dryv.path()).output(output),
      })),
  }),
};
