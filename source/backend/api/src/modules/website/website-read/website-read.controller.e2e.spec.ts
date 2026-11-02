import "reflect-metadata";

import { Global, type INestApplication, Module } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { getDataSourceToken } from "@nestjs/typeorm";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { domainPatternListQueryExample } from "#/modules/website/dto/domain-pattern-list-query.dto.example.ts";
import { domainPatternResponseExample } from "#/modules/website/dto/domain-pattern-response.dto.example.ts";
import { domainPatternsListResponseExample } from "#/modules/website/dto/domain-patterns-list-response.dto.example.ts";
import { siteCheckListQueryExample } from "#/modules/website/dto/site-check-list-query.dto.example.ts";
import { siteCheckResponseExample } from "#/modules/website/dto/site-check-response.dto.example.ts";
import { siteChecksListResponseExample } from "#/modules/website/dto/site-checks-list-response.dto.example.ts";
import { siteDomainListQueryExample } from "#/modules/website/dto/site-domain-list-query.dto.example.ts";
import { siteDomainResponseExample } from "#/modules/website/dto/site-domain-response.dto.example.ts";
import { siteDomainsListResponseExample } from "#/modules/website/dto/site-domains-list-response.dto.example.ts";
import { siteFamiliesListResponseExample } from "#/modules/website/dto/site-families-list-response.dto.example.ts";
import { siteFamilyListQueryExample } from "#/modules/website/dto/site-family-list-query.dto.example.ts";
import { siteFamilyResponseExample } from "#/modules/website/dto/site-family-response.dto.example.ts";
import { siteFingerprintListQueryExample } from "#/modules/website/dto/site-fingerprint-list-query.dto.example.ts";
import { siteFingerprintResponseExample } from "#/modules/website/dto/site-fingerprint-response.dto.example.ts";
import { siteFingerprintsListResponseExample } from "#/modules/website/dto/site-fingerprints-list-response.dto.example.ts";
import { siteListQueryExample } from "#/modules/website/dto/site-list-query.dto.example.ts";
import { siteMemberListQueryExample } from "#/modules/website/dto/site-member-list-query.dto.example.ts";
import { siteMemberResponseExample } from "#/modules/website/dto/site-member-response.dto.example.ts";
import { siteMembersListResponseExample } from "#/modules/website/dto/site-members-list-response.dto.example.ts";
import { sitePublisherListQueryExample } from "#/modules/website/dto/site-publisher-list-query.dto.example.ts";
import { sitePublisherResponseExample } from "#/modules/website/dto/site-publisher-response.dto.example.ts";
import { sitePublishersListResponseExample } from "#/modules/website/dto/site-publishers-list-response.dto.example.ts";
import { siteRelationListQueryExample } from "#/modules/website/dto/site-relation-list-query.dto.example.ts";
import { siteRelationResponseExample } from "#/modules/website/dto/site-relation-response.dto.example.ts";
import { siteRelationsListResponseExample } from "#/modules/website/dto/site-relations-list-response.dto.example.ts";
import { siteResponseExample } from "#/modules/website/dto/site-response.dto.example.ts";
import { siteSubjectListQueryExample } from "#/modules/website/dto/site-subject-list-query.dto.example.ts";
import { siteSubjectResponseExample } from "#/modules/website/dto/site-subject-response.dto.example.ts";
import { siteSubjectsListResponseExample } from "#/modules/website/dto/site-subjects-list-response.dto.example.ts";
import { siteTraitListQueryExample } from "#/modules/website/dto/site-trait-list-query.dto.example.ts";
import { siteTraitResponseExample } from "#/modules/website/dto/site-trait-response.dto.example.ts";
import { siteTraitsListResponseExample } from "#/modules/website/dto/site-traits-list-response.dto.example.ts";
import { sitesListResponseExample } from "#/modules/website/dto/sites-list-response.dto.example.ts";
import { structureFileListQueryExample } from "#/modules/website/dto/structure-file-list-query.dto.example.ts";
import { structureFileResponseExample } from "#/modules/website/dto/structure-file-response.dto.example.ts";
import { structureFilesListResponseExample } from "#/modules/website/dto/structure-files-list-response.dto.example.ts";
import { structureListQueryExample } from "#/modules/website/dto/structure-list-query.dto.example.ts";
import { structureResponseExample } from "#/modules/website/dto/structure-response.dto.example.ts";
import { structureVersionListQueryExample } from "#/modules/website/dto/structure-version-list-query.dto.example.ts";
import { structureVersionResponseExample } from "#/modules/website/dto/structure-version-response.dto.example.ts";
import { structureVersionsListResponseExample } from "#/modules/website/dto/structure-versions-list-response.dto.example.ts";
import { structuresListResponseExample } from "#/modules/website/dto/structures-list-response.dto.example.ts";

import { HttpValidationPipe, httpOptions } from "#/server/http.options.ts";
import { WebsiteWebsiteReadModule } from "#/modules/website/website-read/website-read.module.ts";
import { WebsiteWebsiteReadService } from "#/modules/website/website-read/website-read.service.ts";

/**
 * Managed by Dryv: the Website Read HTTP surface behaves as its contract says. The
 * project implementation is replaced with mocks, so these specs check routing, input binding,
 * validation, status codes and response passthrough without business logic or a database.
 */

// Repositories resolve without a database; the mocked service never reaches them.
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
class InMemoryDataSourceModule {}

const service = {
  findDomainPatterns: vi.fn(),
  findSiteChecks: vi.fn(),
  findSiteDomains: vi.fn(),
  findSiteFamilies: vi.fn(),
  findSiteFingerprints: vi.fn(),
  findSiteMembers: vi.fn(),
  findSitePublishers: vi.fn(),
  findSiteRelations: vi.fn(),
  findSiteSubjects: vi.fn(),
  findSiteTraits: vi.fn(),
  findSites: vi.fn(),
  findStructureFiles: vi.fn(),
  findStructureVersions: vi.fn(),
  findStructures: vi.fn(),
  getDomainPatternById: vi.fn(),
  getSiteById: vi.fn(),
  getSiteCheckById: vi.fn(),
  getSiteDomainById: vi.fn(),
  getSiteFamilyById: vi.fn(),
  getSiteFingerprintById: vi.fn(),
  getSiteMemberById: vi.fn(),
  getSitePublisherById: vi.fn(),
  getSiteRelationById: vi.fn(),
  getSiteSubjectById: vi.fn(),
  getSiteTraitById: vi.fn(),
  getStructureById: vi.fn(),
  getStructureFileById: vi.fn(),
  getStructureVersionById: vi.fn(),
};

type Sent = {
  params: Record<string, unknown>;
  query: Record<string, unknown>;
  headers: Record<string, string>;
  body?: unknown;
};

let app: INestApplication;
let base: string;

beforeAll(async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [InMemoryDataSourceModule, WebsiteWebsiteReadModule],
  })
    .overrideProvider(WebsiteWebsiteReadService)
    .useValue(service)
    .compile();
  app = moduleRef.createNestApplication();
  app.useGlobalPipes(new HttpValidationPipe(httpOptions));
  await app.listen(0);
  base = (await app.getUrl()).replace("[::1]", "localhost");
});

afterAll(async () => {
  await app?.close();
});

beforeEach(() => {
  vi.clearAllMocks();
});

/** Scalar query parameters from an example; nested values stay out of the query string. */
function queryOf(value: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(value).filter(([, item]) => item === null || typeof item !== "object" || Array.isArray(item)),
  );
}

async function send(method: string, path: string, sent: Sent): Promise<Response> {
  const url = new URL(
    base + path.replace(/\{(\w+)\}/g, (_match, name: string) => encodeURIComponent(String(sent.params[name]))),
  );
  for (const [key, value] of Object.entries(sent.query)) {
    for (const item of Array.isArray(value) ? value : [value]) url.searchParams.append(key, String(item));
  }
  return fetch(url, {
    method,
    headers: { "content-type": "application/json", ...sent.headers },
    body: sent.body === undefined ? undefined : JSON.stringify(sent.body),
  });
}

describe("GET /v1/website/domain-patterns (findDomainPatterns)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(domainPatternListQueryExample.valid()), },
        headers: { },
      };
    const result = domainPatternsListResponseExample.valid();
    service.findDomainPatterns.mockResolvedValue(result);

    const response = await send("GET", "/v1/website/domain-patterns", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findDomainPatterns).toHaveBeenCalledTimes(1);
    expect(service.findDomainPatterns).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/website/checks (findSiteChecks)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(siteCheckListQueryExample.valid()), },
        headers: { },
      };
    const result = siteChecksListResponseExample.valid();
    service.findSiteChecks.mockResolvedValue(result);

    const response = await send("GET", "/v1/website/checks", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findSiteChecks).toHaveBeenCalledTimes(1);
    expect(service.findSiteChecks).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/website/domains (findSiteDomains)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(siteDomainListQueryExample.valid()), },
        headers: { },
      };
    const result = siteDomainsListResponseExample.valid();
    service.findSiteDomains.mockResolvedValue(result);

    const response = await send("GET", "/v1/website/domains", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findSiteDomains).toHaveBeenCalledTimes(1);
    expect(service.findSiteDomains).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/website/families (findSiteFamilies)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(siteFamilyListQueryExample.valid()), },
        headers: { },
      };
    const result = siteFamiliesListResponseExample.valid();
    service.findSiteFamilies.mockResolvedValue(result);

    const response = await send("GET", "/v1/website/families", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findSiteFamilies).toHaveBeenCalledTimes(1);
    expect(service.findSiteFamilies).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/website/fingerprints (findSiteFingerprints)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(siteFingerprintListQueryExample.valid()), },
        headers: { },
      };
    const result = siteFingerprintsListResponseExample.valid();
    service.findSiteFingerprints.mockResolvedValue(result);

    const response = await send("GET", "/v1/website/fingerprints", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findSiteFingerprints).toHaveBeenCalledTimes(1);
    expect(service.findSiteFingerprints).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/website/members (findSiteMembers)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(siteMemberListQueryExample.valid()), },
        headers: { },
      };
    const result = siteMembersListResponseExample.valid();
    service.findSiteMembers.mockResolvedValue(result);

    const response = await send("GET", "/v1/website/members", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findSiteMembers).toHaveBeenCalledTimes(1);
    expect(service.findSiteMembers).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/website/site-publishers (findSitePublishers)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(sitePublisherListQueryExample.valid()), },
        headers: { },
      };
    const result = sitePublishersListResponseExample.valid();
    service.findSitePublishers.mockResolvedValue(result);

    const response = await send("GET", "/v1/website/site-publishers", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findSitePublishers).toHaveBeenCalledTimes(1);
    expect(service.findSitePublishers).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/website/relations (findSiteRelations)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(siteRelationListQueryExample.valid()), },
        headers: { },
      };
    const result = siteRelationsListResponseExample.valid();
    service.findSiteRelations.mockResolvedValue(result);

    const response = await send("GET", "/v1/website/relations", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findSiteRelations).toHaveBeenCalledTimes(1);
    expect(service.findSiteRelations).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/website/subjects (findSiteSubjects)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(siteSubjectListQueryExample.valid()), },
        headers: { },
      };
    const result = siteSubjectsListResponseExample.valid();
    service.findSiteSubjects.mockResolvedValue(result);

    const response = await send("GET", "/v1/website/subjects", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findSiteSubjects).toHaveBeenCalledTimes(1);
    expect(service.findSiteSubjects).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/website/traits (findSiteTraits)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(siteTraitListQueryExample.valid()), },
        headers: { },
      };
    const result = siteTraitsListResponseExample.valid();
    service.findSiteTraits.mockResolvedValue(result);

    const response = await send("GET", "/v1/website/traits", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findSiteTraits).toHaveBeenCalledTimes(1);
    expect(service.findSiteTraits).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/website/sites (findSites)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(siteListQueryExample.valid()), },
        headers: { },
      };
    const result = sitesListResponseExample.valid();
    service.findSites.mockResolvedValue(result);

    const response = await send("GET", "/v1/website/sites", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findSites).toHaveBeenCalledTimes(1);
    expect(service.findSites).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/website/structure-files (findStructureFiles)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(structureFileListQueryExample.valid()), },
        headers: { },
      };
    const result = structureFilesListResponseExample.valid();
    service.findStructureFiles.mockResolvedValue(result);

    const response = await send("GET", "/v1/website/structure-files", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findStructureFiles).toHaveBeenCalledTimes(1);
    expect(service.findStructureFiles).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/website/structure-versions (findStructureVersions)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(structureVersionListQueryExample.valid()), },
        headers: { },
      };
    const result = structureVersionsListResponseExample.valid();
    service.findStructureVersions.mockResolvedValue(result);

    const response = await send("GET", "/v1/website/structure-versions", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findStructureVersions).toHaveBeenCalledTimes(1);
    expect(service.findStructureVersions).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/website/structures (findStructures)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(structureListQueryExample.valid()), },
        headers: { },
      };
    const result = structuresListResponseExample.valid();
    service.findStructures.mockResolvedValue(result);

    const response = await send("GET", "/v1/website/structures", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findStructures).toHaveBeenCalledTimes(1);
    expect(service.findStructures).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/website/domain-patterns/{domainPatternId} (getDomainPatternById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "domainPatternId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = domainPatternResponseExample.valid();
    service.getDomainPatternById.mockResolvedValue(result);

    const response = await send("GET", "/v1/website/domain-patterns/{domainPatternId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getDomainPatternById).toHaveBeenCalledTimes(1);
    expect(service.getDomainPatternById).toHaveBeenCalledWith(expect.objectContaining({ domainPatternId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/website/sites/{siteId} (getSiteById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "siteId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = siteResponseExample.valid();
    service.getSiteById.mockResolvedValue(result);

    const response = await send("GET", "/v1/website/sites/{siteId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getSiteById).toHaveBeenCalledTimes(1);
    expect(service.getSiteById).toHaveBeenCalledWith(expect.objectContaining({ siteId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/website/checks/{siteCheckId} (getSiteCheckById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "siteCheckId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = siteCheckResponseExample.valid();
    service.getSiteCheckById.mockResolvedValue(result);

    const response = await send("GET", "/v1/website/checks/{siteCheckId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getSiteCheckById).toHaveBeenCalledTimes(1);
    expect(service.getSiteCheckById).toHaveBeenCalledWith(expect.objectContaining({ siteCheckId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/website/domains/{domainId} (getSiteDomainById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "domainId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = siteDomainResponseExample.valid();
    service.getSiteDomainById.mockResolvedValue(result);

    const response = await send("GET", "/v1/website/domains/{domainId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getSiteDomainById).toHaveBeenCalledTimes(1);
    expect(service.getSiteDomainById).toHaveBeenCalledWith(expect.objectContaining({ domainId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/website/families/{familyId} (getSiteFamilyById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "familyId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = siteFamilyResponseExample.valid();
    service.getSiteFamilyById.mockResolvedValue(result);

    const response = await send("GET", "/v1/website/families/{familyId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getSiteFamilyById).toHaveBeenCalledTimes(1);
    expect(service.getSiteFamilyById).toHaveBeenCalledWith(expect.objectContaining({ familyId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/website/fingerprints/{siteFingerprintId} (getSiteFingerprintById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "siteFingerprintId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = siteFingerprintResponseExample.valid();
    service.getSiteFingerprintById.mockResolvedValue(result);

    const response = await send("GET", "/v1/website/fingerprints/{siteFingerprintId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getSiteFingerprintById).toHaveBeenCalledTimes(1);
    expect(service.getSiteFingerprintById).toHaveBeenCalledWith(expect.objectContaining({ siteFingerprintId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/website/members/{siteMemberId} (getSiteMemberById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "siteMemberId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = siteMemberResponseExample.valid();
    service.getSiteMemberById.mockResolvedValue(result);

    const response = await send("GET", "/v1/website/members/{siteMemberId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getSiteMemberById).toHaveBeenCalledTimes(1);
    expect(service.getSiteMemberById).toHaveBeenCalledWith(expect.objectContaining({ siteMemberId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/website/site-publishers/{sitePublisherId} (getSitePublisherById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "sitePublisherId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = sitePublisherResponseExample.valid();
    service.getSitePublisherById.mockResolvedValue(result);

    const response = await send("GET", "/v1/website/site-publishers/{sitePublisherId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getSitePublisherById).toHaveBeenCalledTimes(1);
    expect(service.getSitePublisherById).toHaveBeenCalledWith(expect.objectContaining({ sitePublisherId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/website/relations/{siteRelationId} (getSiteRelationById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "siteRelationId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = siteRelationResponseExample.valid();
    service.getSiteRelationById.mockResolvedValue(result);

    const response = await send("GET", "/v1/website/relations/{siteRelationId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getSiteRelationById).toHaveBeenCalledTimes(1);
    expect(service.getSiteRelationById).toHaveBeenCalledWith(expect.objectContaining({ siteRelationId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/website/subjects/{siteSubjectId} (getSiteSubjectById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "siteSubjectId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = siteSubjectResponseExample.valid();
    service.getSiteSubjectById.mockResolvedValue(result);

    const response = await send("GET", "/v1/website/subjects/{siteSubjectId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getSiteSubjectById).toHaveBeenCalledTimes(1);
    expect(service.getSiteSubjectById).toHaveBeenCalledWith(expect.objectContaining({ siteSubjectId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/website/traits/{siteTraitId} (getSiteTraitById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "siteTraitId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = siteTraitResponseExample.valid();
    service.getSiteTraitById.mockResolvedValue(result);

    const response = await send("GET", "/v1/website/traits/{siteTraitId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getSiteTraitById).toHaveBeenCalledTimes(1);
    expect(service.getSiteTraitById).toHaveBeenCalledWith(expect.objectContaining({ siteTraitId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/website/structures/{structureId} (getStructureById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "structureId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = structureResponseExample.valid();
    service.getStructureById.mockResolvedValue(result);

    const response = await send("GET", "/v1/website/structures/{structureId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getStructureById).toHaveBeenCalledTimes(1);
    expect(service.getStructureById).toHaveBeenCalledWith(expect.objectContaining({ structureId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/website/structure-files/{structureFileId} (getStructureFileById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "structureFileId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = structureFileResponseExample.valid();
    service.getStructureFileById.mockResolvedValue(result);

    const response = await send("GET", "/v1/website/structure-files/{structureFileId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getStructureFileById).toHaveBeenCalledTimes(1);
    expect(service.getStructureFileById).toHaveBeenCalledWith(expect.objectContaining({ structureFileId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/website/structure-versions/{structureVersionId} (getStructureVersionById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "structureVersionId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = structureVersionResponseExample.valid();
    service.getStructureVersionById.mockResolvedValue(result);

    const response = await send("GET", "/v1/website/structure-versions/{structureVersionId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getStructureVersionById).toHaveBeenCalledTimes(1);
    expect(service.getStructureVersionById).toHaveBeenCalledWith(expect.objectContaining({ structureVersionId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});