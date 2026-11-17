/**
 * Governance: public institutions, the offices they hold, who has held them, and what they are meant to do.
 * Public reads. Names live in Official; the queries bring them in so a client never joins by hand.
 */
import * as dryv from "@dryvcode/author";
import { sharedFailures as f, sharedProperties as p } from "#/schemas/_shared.ts";
import { governance, Holders, Institutions, Mandates, Offices } from "#/schemas/postgres/governance.ts";
import { Entities, Individuals, Names as OfficialNames } from "#/schemas/postgres/official.ts";
import { Value } from "#/schemas/postgres/reference.ts";
import { apiHttp, MAX_PAGE, PageWindow } from "./_shared.ts";

const bodies = governance.feature("Institutions").failureDefaults(apiHttp);
const institution = Institutions.asRef();
const office = Offices.asRef();
const holder = Holders.asRef();
const mandate = Mandates.asRef();
const entity = Entities.asRef();
const individual = Individuals.asRef();
const officialName = OfficialNames.asRef();
const value = Value.asRef();

const InstitutionWindow = governance
  .schema("InstitutionWindow", { codePrefix: dryv.field(p.IdentityCode).optional() })
  .extends(PageWindow)
  .asRef();
const InstitutionKey = governance.schema("InstitutionKey", { institutionId: dryv.field(p.Id) }).asRef();
const OfficeKey = governance.schema("OfficeKey", { officeId: dryv.field(p.Id) }).asRef();

const { ScanInstitutions, FindInstitution, FindOffice } = bodies.queries({
  ScanInstitutions: dryv.readQuery
    .from(institution)
    .input(InstitutionWindow)
    .where((row, args) => [row.fields.code.compare("prefix", args.codePrefix), row.fields.deletedAt.isNull()])
    .select((row) => ({
      id: row.fields.id,
      code: row.fields.code,
      kind: row.follow(institution.fields.institutionKindId, value).fields.code,
      names: row
        .follow(institution.fields.entityId, entity)
        .reverse(officialName.fields.entityId, officialName)
        .select(
          (n) => ({ name: n.fields.name, languageId: n.fields.languageId, isPreferred: n.fields.isPreferred }),
          (n) => [n.fields.name.order("asc"), n.fields.id.order("asc")],
        ),
    }))
    .orderBy(({ fields }) => [fields.code.order("asc"), fields.id.order("asc")])
    .page(({ limit, offset }) => ({ limit, offset, maxLimit: MAX_PAGE })),

  FindInstitution: dryv.readQuery
    .from(institution)
    .input(InstitutionKey)
    .where((row, args) => [row.fields.id.eq(args.institutionId), row.fields.deletedAt.isNull()])
    .select((row) => ({
      id: row.fields.id,
      code: row.fields.code,
      kind: row.follow(institution.fields.institutionKindId, value).fields.code,
      validFrom: row.fields.validFrom,
      validUntil: row.fields.validUntil,
      names: row
        .follow(institution.fields.entityId, entity)
        .reverse(officialName.fields.entityId, officialName)
        .select(
          (n) => ({ name: n.fields.name, languageId: n.fields.languageId, isPreferred: n.fields.isPreferred }),
          (n) => [n.fields.name.order("asc"), n.fields.id.order("asc")],
        ),
      mandates: row.reverse(mandate.fields.institutionId, mandate).select(
        (m) => ({
          kind: m.follow(mandate.fields.mandateKindId, value).fields.code,
          description: m.fields.description,
          validFrom: m.fields.validFrom,
          validUntil: m.fields.validUntil,
        }),
        (m) => [m.fields.validFrom.order("desc"), m.fields.id.order("asc")],
      ),
      offices: row.reverse(office.fields.institutionId, office).select(
        (o) => ({
          id: o.fields.id,
          code: o.fields.code,
          kind: o.follow(office.fields.officeKindId, value).fields.code,
        }),
        (o) => [o.fields.code.order("asc"), o.fields.id.order("asc")],
      ),
    }))
    .orderBy(({ fields }) => [fields.id.order("asc")])
    .zeroOrOne(),

  FindOffice: dryv.readQuery
    .from(office)
    .input(OfficeKey)
    .where((row, args) => [row.fields.id.eq(args.officeId), row.fields.deletedAt.isNull()])
    .select((row) => ({
      id: row.fields.id,
      code: row.fields.code,
      kind: row.follow(office.fields.officeKindId, value).fields.code,
      institutionId: row.fields.institutionId,
      unitFeatureId: row.fields.unitFeatureId,
      holders: row.reverse(holder.fields.officeId, holder).select(
        (h) => ({
          individualId: h.fields.individualId,
          appointment: h.follow(holder.fields.appointmentKindId, value).fields.code,
          validFrom: h.fields.validFrom,
          validUntil: h.fields.validUntil,
          names: h
            .follow(holder.fields.individualId, individual)
            .reverse(officialName.fields.individualId, officialName)
            .select(
              (n) => ({ name: n.fields.name, isPreferred: n.fields.isPreferred }),
              (n) => [n.fields.name.order("asc"), n.fields.id.order("asc")],
            ),
        }),
        (h) => [h.fields.validFrom.order("desc"), h.fields.id.order("asc")],
      ),
    }))
    .orderBy(({ fields }) => [fields.id.order("asc")])
    .zeroOrOne(),
});

const rows = bodies.schemas({
  InstitutionEntry: dryv.schema.fromQuery(ScanInstitutions),
  InstitutionDetail: dryv.schema.fromQuery(FindInstitution),
  OfficeDetail: dryv.schema.fromQuery(FindOffice),
});
const io = bodies.schemas({
  InstitutionCollection: dryv.schema({ institutions: dryv.field(rows.InstitutionEntry).array() }),
});

export const governanceOperations = bodies.operations({
  BrowseInstitutions: dryv
    .operation()
    .role("list")
    .description("Page through public institutions with their names, optionally by code prefix.")
    .input(InstitutionWindow)
    .output(io.InstitutionCollection)
    .queryFromInput(ScanInstitutions, { envelope: { institutions: "rows" } })
    .facets(({ input, output }) => ({
      http: dryv.http("GET", "/v1/governance/institutions").input(input, dryv.queryObject()).output(output),
    })),

  GetInstitution: dryv
    .operation()
    .role("detail")
    .description("One institution with its mandates and offices.")
    .input(InstitutionKey)
    .output(rows.InstitutionDetail)
    .queryFromInput(FindInstitution, { missing: f.NotFound })
    .facets(({ inputField, output }) => ({
      http: dryv
        .http("GET", "/v1/governance/institutions/{institutionId}")
        .input(inputField("institutionId"), dryv.path())
        .output(output),
    })),

  GetOffice: dryv
    .operation()
    .role("detail")
    .description("One office with everyone who has held it, newest first.")
    .input(OfficeKey)
    .output(rows.OfficeDetail)
    .queryFromInput(FindOffice, { missing: f.NotFound })
    .facets(({ inputField, output }) => ({
      http: dryv.http("GET", "/v1/governance/offices/{officeId}").input(inputField("officeId"), dryv.path()).output(output),
    })),
});
