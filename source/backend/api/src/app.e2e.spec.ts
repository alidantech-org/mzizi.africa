import "reflect-metadata";

import { Global, type INestApplication, Module } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { getDataSourceToken } from "@nestjs/typeorm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { AppModule } from "#/app.module.ts";
import { DatabaseModule } from "./database/database.module.ts";

// Stands in for the project's DatabaseModule: repositories resolve without a database.
@Global()
@Module({
  providers: [
    {
      provide: getDataSourceToken(),
      useValue: { options: { type: "postgres" }, entityMetadatas: [], getRepository: () => ({}) },
    },
  ],
  exports: [getDataSourceToken()],
})
class InMemoryDatabaseModule {}

/**
 * Managed by Dryv: the assembled application (AppModule -> group modules -> feature modules ->
 * the project's implementations) boots and serves every route its contracts declare. A route
 * may answer 4xx/5xx while its use case is unimplemented, but it must never be missing (404).
 */
const routes: Array<[method: string, path: string]> = [
  ["POST", "/v1/audit/comments"],
  ["POST", "/v1/audit/evidence"],
  ["POST", "/v1/audit/decisions"],
  ["GET", "/v1/audit/comments"],
  ["GET", "/v1/audit/evidence"],
  ["GET", "/v1/audit/decisions"],
  ["GET", "/v1/audit/comments/{commentId}".replace("{commentId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/audit/evidence/{evidenceId}".replace("{evidenceId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/audit/decisions/{decisionId}".replace("{decisionId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/debt/disbursements"],
  ["GET", "/v1/debt/repayments"],
  ["GET", "/v1/debt/loans"],
  ["GET", "/v1/debt/loans/{loanId}".replace("{loanId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/debt/disbursements/{disbursementId}".replace("{disbursementId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/debt/repayments/{repaymentId}".replace("{repaymentId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/elections/candidates"],
  ["GET", "/v1/elections/results"],
  ["GET", "/v1/elections/elections"],
  ["GET", "/v1/elections/manifesto-commitments"],
  ["GET", "/v1/elections/manifestos"],
  ["GET", "/v1/elections/seats"],
  ["GET", "/v1/elections/candidates/{candidateId}".replace("{candidateId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/elections/elections/{electionId}".replace("{electionId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/elections/results/{resultId}".replace("{resultId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/elections/manifestos/{manifestoId}".replace("{manifestoId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/elections/manifesto-commitments/{commitmentId}".replace("{commitmentId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/elections/seats/{seatId}".replace("{seatId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/entities/identifiers"],
  ["GET", "/v1/entities/locations"],
  ["GET", "/v1/entities/ownerships"],
  ["GET", "/v1/entities/legal-entities"],
  ["GET", "/v1/entities/identifiers/{identifierId}".replace("{identifierId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/entities/locations/{locationId}".replace("{locationId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/entities/ownerships/{ownershipId}".replace("{ownershipId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/entities/legal-entities/{entityId}".replace("{entityId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/events/links"],
  ["GET", "/v1/events/events"],
  ["GET", "/v1/events/events/{eventId}".replace("{eventId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/events/links/{linkId}".replace("{linkId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/filesystem/attachments"],
  ["GET", "/v1/filesystem/versions"],
  ["GET", "/v1/filesystem/files"],
  ["GET", "/v1/filesystem/folders"],
  ["GET", "/v1/filesystem/formats"],
  ["GET", "/v1/filesystem/attachments/{attachmentId}".replace("{attachmentId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/filesystem/files/{fileId}".replace("{fileId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/filesystem/versions/{versionId}".replace("{versionId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/filesystem/folders/{folderId}".replace("{folderId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/filesystem/formats/{formatId}".replace("{formatId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/finance/units"],
  ["GET", "/v1/finance/budgets"],
  ["GET", "/v1/finance/expenditures"],
  ["GET", "/v1/finance/fiscal-years"],
  ["GET", "/v1/finance/ledger-entries"],
  ["GET", "/v1/finance/revenue"],
  ["GET", "/v1/finance/transfers"],
  ["GET", "/v1/finance/budgets/{budgetId}".replace("{budgetId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/finance/units/{unitId}".replace("{unitId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/finance/expenditures/{expenditureId}".replace("{expenditureId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/finance/fiscal-years/{fiscalYearId}".replace("{fiscalYearId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/finance/ledger-entries/{entryId}".replace("{entryId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/finance/revenue/{revenueId}".replace("{revenueId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/finance/transfers/{transferId}".replace("{transferId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/geography/entities/{entityId}/children/boundaries".replace("{entityId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/geography/units/{unitId}".replace("{unitId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/geography/entities/{entityId}/boundary".replace("{entityId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/geography/entities/{entityId}".replace("{entityId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/geography/entities/{entityId}/hierarchy".replace("{entityId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/geography/entities/{entityId}/history".replace("{entityId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/geography/entities/{entityId}/map-context".replace("{entityId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/geography/boundaries"],
  ["GET", "/v1/geography/search"],
  ["GET", "/v1/governance/institution-relationships"],
  ["GET", "/v1/governance/institutions"],
  ["GET", "/v1/governance/office-holders"],
  ["GET", "/v1/governance/office-rules"],
  ["GET", "/v1/governance/offices"],
  ["GET", "/v1/governance/selection-procedures"],
  ["GET", "/v1/governance/selection-stages"],
  ["GET", "/v1/geography/entities/{entityId}/governance".replace("{entityId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/governance/institutions/{institutionId}".replace("{institutionId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/governance/institution-relationships/{relationshipId}".replace("{relationshipId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/governance/offices/{officeId}".replace("{officeId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/governance/office-holders/{holderId}".replace("{holderId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/governance/office-rules/{ruleId}".replace("{ruleId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/governance/selection-procedures/{procedureId}".replace("{procedureId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/governance/selection-stages/{stageId}".replace("{stageId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/legal/amendment-changes"],
  ["GET", "/v1/legal/amendments"],
  ["GET", "/v1/legal/authority-links"],
  ["GET", "/v1/legal/instruments"],
  ["GET", "/v1/legal/provisions"],
  ["GET", "/v1/legal/amendments/{amendmentId}".replace("{amendmentId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/legal/amendment-changes/{changeId}".replace("{changeId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/legal/authority-links/{linkId}".replace("{linkId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/legal/instruments/{instrumentId}".replace("{instrumentId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/legal/provisions/{provisionId}".replace("{provisionId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/people/individuals"],
  ["GET", "/v1/people/contacts"],
  ["GET", "/v1/people/handles"],
  ["GET", "/v1/people/names"],
  ["GET", "/v1/people/profiles"],
  ["GET", "/v1/people/individuals/{personId}".replace("{personId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/people/contacts/{contactId}".replace("{contactId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/people/handles/{handleId}".replace("{handleId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/people/names/{personNameId}".replace("{personNameId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/people/profiles/{profileId}".replace("{profileId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/political/ideologies"],
  ["GET", "/v1/political/parties"],
  ["GET", "/v1/political/party-ideologies"],
  ["GET", "/v1/political/memberships"],
  ["GET", "/v1/political/position-holders"],
  ["GET", "/v1/political/positions"],
  ["GET", "/v1/political/units"],
  ["GET", "/v1/political/ideologies/{ideologyId}".replace("{ideologyId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/political/parties/{partyId}".replace("{partyId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/political/party-ideologies/{partyIdeologyId}".replace("{partyIdeologyId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/political/memberships/{membershipId}".replace("{membershipId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/political/positions/{positionId}".replace("{positionId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/political/position-holders/{holderId}".replace("{holderId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/political/units/{unitId}".replace("{unitId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/procurement/bids"],
  ["GET", "/v1/procurement/milestones"],
  ["GET", "/v1/procurement/variations"],
  ["GET", "/v1/procurement/contracts"],
  ["GET", "/v1/procurement/tenders"],
  ["GET", "/v1/procurement/bids/{bidId}".replace("{bidId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/procurement/milestones/{milestoneId}".replace("{milestoneId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/procurement/variations/{variationId}".replace("{variationId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/procurement/contracts/{contractId}".replace("{contractId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/procurement/tenders/{tenderId}".replace("{tenderId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/reference/classification-records"],
  ["GET", "/v1/reference/jurisdictions"],
  ["GET", "/v1/reference/classification-records/{recordId}".replace("{recordId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/reference/jurisdictions/{jurisdictionId}".replace("{jurisdictionId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/services/amenities"],
  ["GET", "/v1/services/amenity-offices"],
  ["GET", "/v1/services/services"],
  ["GET", "/v1/services/deliveries"],
  ["GET", "/v1/services/amenities/{amenityId}".replace("{amenityId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/services/amenity-offices/{amenityOfficeId}".replace("{amenityOfficeId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/services/services/{serviceId}".replace("{serviceId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/services/deliveries/{deliveryId}".replace("{deliveryId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/source/attributions"],
  ["GET", "/v1/source/captures"],
  ["GET", "/v1/source/documents"],
  ["GET", "/v1/source/methods"],
  ["GET", "/v1/source/publishers"],
  ["GET", "/v1/source/verifications"],
  ["GET", "/v1/source/attributions/{attributionId}".replace("{attributionId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/source/captures/{captureId}".replace("{captureId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/source/documents/{documentId}".replace("{documentId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/source/methods/{methodId}".replace("{methodId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/source/publishers/{publisherId}".replace("{publisherId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/source/verifications/{verificationId}".replace("{verificationId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/statistics/indicator-categories"],
  ["GET", "/v1/statistics/indicator-columns"],
  ["GET", "/v1/statistics/indicators"],
  ["GET", "/v1/statistics/observations"],
  ["GET", "/v1/statistics/periods"],
  ["GET", "/v1/statistics/tables"],
  ["GET", "/v1/statistics/indicators/{indicatorId}".replace("{indicatorId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/statistics/indicator-categories/{categoryId}".replace("{categoryId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/statistics/indicator-columns/{columnId}".replace("{columnId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/statistics/observations/{observationId}".replace("{observationId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/statistics/periods/{periodId}".replace("{periodId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/statistics/tables/{tableId}".replace("{tableId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/website/checks"],
  ["GET", "/v1/website/domains"],
  ["GET", "/v1/website/site-publishers"],
  ["GET", "/v1/website/sites"],
  ["GET", "/v1/website/structure-files"],
  ["GET", "/v1/website/structure-versions"],
  ["GET", "/v1/website/structures"],
  ["GET", "/v1/website/sites/{siteId}".replace("{siteId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/website/checks/{siteCheckId}".replace("{siteCheckId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/website/domains/{domainId}".replace("{domainId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/website/site-publishers/{sitePublisherId}".replace("{sitePublisherId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/website/structures/{structureId}".replace("{structureId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/website/structure-files/{structureFileId}".replace("{structureFileId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
  ["GET", "/v1/website/structure-versions/{structureVersionId}".replace("{structureVersionId}", encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")))],
];

let app: INestApplication;
let base: string;

beforeAll(async () => {
  const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
    .overrideModule(DatabaseModule)
    .useModule(InMemoryDatabaseModule)
    .compile();
  app = moduleRef.createNestApplication();
  await app.listen(0);
  base = (await app.getUrl()).replace("[::1]", "localhost");
});

afterAll(async () => {
  await app?.close();
});

describe("application assembly", () => {
  it.each(routes)("serves %s %s", async (method, path) => {
    const response = await fetch(base + path, {
      method,
      headers: { "content-type": "application/json" },
      body: method === "GET" || method === "DELETE" ? undefined : "{}",
    });
    expect(response.status).not.toBe(404);
  });
});