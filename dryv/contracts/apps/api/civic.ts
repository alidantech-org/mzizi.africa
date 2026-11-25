/**
 * Module `civic`: projects for a place, tenders and contracts, and public facilities.
 */
import * as dryv from "@dryvcode/author";
import { sharedFailures as f, sharedProperties as p } from "#/schemas/_shared.ts";
import { Bids, civic, Contracts, Facilities, Procurements, Projects, Sites } from "#/schemas/postgres/civic.ts";
import { Currencies } from "#/schemas/postgres/reference.ts";
import { apiHttp, CACHE, identityRef, MAX_PAGE, namesOf, PageWindow } from "./_shared.ts";

const delivery = civic.feature("Delivery").failureDefaults(apiHttp);
const buying = civic.feature("Buying").failureDefaults(apiHttp);
const project = Projects.asRef();
const site = Sites.asRef();
const procurement = Procurements.asRef();
const bid = Bids.asRef();
const contract = Contracts.asRef();
const facility = Facilities.asRef();
const currency = Currencies.asRef();

const PlaceProjects = civic
  .schema("PlaceProjects", { featureId: dryv.field(p.Id) })
  .extends(PageWindow)
  .asRef();
const ProjectKey = civic.schema("ProjectKey", { code: dryv.field(p.IdentityCode) }).asRef();
const CountryTenders = civic
  .schema("CountryTenders", { countryId: dryv.field(p.Id), statusTerm: dryv.field(p.Id).optional() })
  .extends(PageWindow)
  .asRef();
const TenderKey = civic.schema("TenderKey", { code: dryv.field(p.IdentityCode) }).asRef();
const CountryFacilities = civic
  .schema("CountryFacilities", { countryId: dryv.field(p.Id), classTerm: dryv.field(p.Id).optional() })
  .extends(PageWindow)
  .asRef();

const q = {
  ...delivery.queries({
    ScanPlaceProjects: dryv.readQuery
      .from(site)
      .input(PlaceProjects)
      .where((row, args) => [row.fields.featureId.eq(args.featureId)])
      .select((row) => ({
        projectId: row.fields.projectId,
        code: row.follow(site.fields.projectId, project).fields.code,
        statusTerm: row.follow(site.fields.projectId, project).fields.statusTerm,
        siteKindTerm: row.fields.kindTerm,
        fromYear: row.follow(site.fields.projectId, project).fields.fromYear,
        toYear: row.follow(site.fields.projectId, project).fields.toYear,
        names: namesOf(row.follow(site.fields.projectId, project).follow(project.fields.id, identityRef)),
      }))
      .orderBy((row) => [row.fields.projectId.order("asc"), row.fields.id.order("asc")])
      .page(({ limit, offset }) => ({ limit, offset, maxLimit: MAX_PAGE })),
    FindProject: dryv.readQuery
      .from(project)
      .input(ProjectKey)
      .where((row, args) => [row.fields.code.eq(args.code)])
      .select((row) => ({
        projectId: row.fields.id,
        code: row.fields.code,
        statusTerm: row.fields.statusTerm,
        institutionId: row.fields.institutionId,
        sponsorId: row.fields.sponsorId,
        implementerId: row.fields.implementerId,
        fromYear: row.fields.fromYear,
        toYear: row.fields.toYear,
        names: namesOf(row.follow(project.fields.id, identityRef)),
        sites: row.reverse(site.fields.projectId, site).select(
          (s) => ({ featureId: s.fields.featureId, kindTerm: s.fields.kindTerm }),
          (s) => [s.fields.id.order("asc")],
        ),
        contracts: row.reverse(contract.fields.projectId, contract).select(
          (c) => ({
            contractId: c.fields.id,
            code: c.fields.code,
            contractorId: c.fields.contractorId,
            amount: c.fields.amount,
            currencyCode: c.follow(contract.fields.currencyId, currency).fields.isoCode,
            statusTerm: c.fields.statusTerm,
            signedOn: c.fields.signedOn,
          }),
          (c) => [c.fields.signedOn.order("desc"), c.fields.id.order("asc")],
        ),
      }))
      .orderBy((row) => [row.fields.id.order("asc")])
      .zeroOrOne(),
    ScanFacilities: dryv.readQuery
      .from(facility)
      .input(CountryFacilities)
      .where((row, args) => [row.fields.countryId.eq(args.countryId), row.fields.classTerm.eq(args.classTerm)])
      .select((row) => ({
        facilityId: row.fields.id,
        code: row.fields.code,
        classTerm: row.fields.classTerm,
        ownershipTerm: row.fields.ownershipTerm,
        statusTerm: row.fields.statusTerm,
        names: namesOf(row.follow(facility.fields.id, identityRef)),
      }))
      .orderBy((row) => [row.fields.code.order("asc"), row.fields.id.order("asc")])
      .page(({ limit, offset }) => ({ limit, offset, maxLimit: MAX_PAGE })),
  }),
  ...buying.queries({
    ScanTenders: dryv.readQuery
      .from(procurement)
      .input(CountryTenders)
      .where((row, args) => [row.fields.countryId.eq(args.countryId), row.fields.statusTerm.eq(args.statusTerm)])
      .select((row) => ({
        procurementId: row.fields.id,
        code: row.fields.code,
        categoryTerm: row.fields.categoryTerm,
        procedureTerm: row.fields.procedureTerm,
        statusTerm: row.fields.statusTerm,
        buyerId: row.fields.buyerId,
        publishedOn: row.fields.publishedOn,
        closesOn: row.fields.closesOn,
        amount: row.fields.amount,
        currencyCode: row.follow(procurement.fields.currencyId, currency).fields.isoCode,
        names: namesOf(row.follow(procurement.fields.id, identityRef)),
      }))
      .orderBy((row) => [row.fields.publishedOn.order("desc"), row.fields.id.order("asc")])
      .page(({ limit, offset }) => ({ limit, offset, maxLimit: MAX_PAGE })),
    FindTender: dryv.readQuery
      .from(procurement)
      .input(TenderKey)
      .where((row, args) => [row.fields.code.eq(args.code)])
      .select((row) => ({
        procurementId: row.fields.id,
        code: row.fields.code,
        categoryTerm: row.fields.categoryTerm,
        procedureTerm: row.fields.procedureTerm,
        statusTerm: row.fields.statusTerm,
        buyerId: row.fields.buyerId,
        projectId: row.fields.projectId,
        amount: row.fields.amount,
        currencyCode: row.follow(procurement.fields.currencyId, currency).fields.isoCode,
        bidderCount: row.fields.bidderCount,
        names: namesOf(row.follow(procurement.fields.id, identityRef)),
        bids: row.reverse(bid.fields.procurementId, bid).select(
          (b) => ({
            bidderId: b.fields.bidderId,
            amount: b.fields.amount,
            outcomeTerm: b.fields.outcomeTerm,
            submittedOn: b.fields.submittedOn,
          }),
          (b) => [b.fields.amount.order("asc"), b.fields.id.order("asc")],
        ),
      }))
      .orderBy((row) => [row.fields.id.order("asc")])
      .zeroOrOne(),
  }),
};
export const civicQueries = q;
const rows = civic.schemas({
  ProjectEntry: dryv.schema.fromQuery(q.ScanPlaceProjects),
  ProjectDetail: dryv.schema.fromQuery(q.FindProject),
  FacilityEntry: dryv.schema.fromQuery(q.ScanFacilities),
  TenderEntry: dryv.schema.fromQuery(q.ScanTenders),
  TenderDetail: dryv.schema.fromQuery(q.FindTender),
});
export const civicRows = rows;
const io = civic.schemas({
  ProjectCollection: dryv.schema({ projects: dryv.field(rows.ProjectEntry).array() }),
  FacilityCollection: dryv.schema({ facilities: dryv.field(rows.FacilityEntry).array() }),
  TenderCollection: dryv.schema({ tenders: dryv.field(rows.TenderEntry).array() }),
});

export const civicOperations = {
  ...delivery.operations({
    ListPlaceProjects: dryv
      .operation()
      .role("list")
      .description("The projects that touch a place.")
      .input(PlaceProjects)
      .output(io.ProjectCollection)
      .queryFromInput(q.ScanPlaceProjects, { envelope: { projects: "rows" } })
      .cache(CACHE.structure)
      .facets(({ input, output }) => ({
        http: dryv.http("GET", "/v1/civic/projects").input(input, dryv.queryObject()).output(output),
      })),
    GetProject: dryv
      .operation()
      .role("detail")
      .description("One project with its places and contracts.")
      .input(ProjectKey)
      .output(rows.ProjectDetail)
      .queryFromInput(q.FindProject, { missing: f.NotFound })
      .cache(CACHE.structure)
      .facets(({ inputField, output }) => ({
        http: dryv.http("GET", "/v1/civic/projects/{code}").input(inputField("code"), dryv.path()).output(output),
      })),
    ListFacilities: dryv
      .operation()
      .role("list")
      .description("A country's public facilities, optionally of one class.")
      .input(CountryFacilities)
      .output(io.FacilityCollection)
      .queryFromInput(q.ScanFacilities, { envelope: { facilities: "rows" } })
      .cache(CACHE.structure)
      .facets(({ input, output }) => ({
        http: dryv.http("GET", "/v1/civic/facilities").input(input, dryv.queryObject()).output(output),
      })),
  }),
  ...buying.operations({
    ListTenders: dryv
      .operation()
      .role("list")
      .description("A country's tenders, newest first, optionally by status.")
      .input(CountryTenders)
      .output(io.TenderCollection)
      .queryFromInput(q.ScanTenders, { envelope: { tenders: "rows" } })
      .cache(CACHE.structure)
      .facets(({ input, output }) => ({
        http: dryv.http("GET", "/v1/civic/tenders").input(input, dryv.queryObject()).output(output),
      })),
    GetTender: dryv
      .operation()
      .role("detail")
      .description("One tender with every bid, cheapest first, including those that lost.")
      .input(TenderKey)
      .output(rows.TenderDetail)
      .queryFromInput(q.FindTender, { missing: f.NotFound })
      .cache(CACHE.structure)
      .facets(({ inputField, output }) => ({
        http: dryv.http("GET", "/v1/civic/tenders/{code}").input(inputField("code"), dryv.path()).output(output),
      })),
  }),
};
