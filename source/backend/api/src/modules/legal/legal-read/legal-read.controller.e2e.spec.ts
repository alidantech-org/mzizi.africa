import "reflect-metadata";

import { Global, type INestApplication, Module } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { getDataSourceToken } from "@nestjs/typeorm";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { legalAmendmentChangeListQueryExample } from "#/modules/legal/dto/legal-amendment-change-list-query.dto.example.ts";
import { legalAmendmentChangeResponseExample } from "#/modules/legal/dto/legal-amendment-change-response.dto.example.ts";
import { legalAmendmentChangesListResponseExample } from "#/modules/legal/dto/legal-amendment-changes-list-response.dto.example.ts";
import { legalAmendmentListQueryExample } from "#/modules/legal/dto/legal-amendment-list-query.dto.example.ts";
import { legalAmendmentResponseExample } from "#/modules/legal/dto/legal-amendment-response.dto.example.ts";
import { legalAmendmentsListResponseExample } from "#/modules/legal/dto/legal-amendments-list-response.dto.example.ts";
import { legalAuthorityLinkListQueryExample } from "#/modules/legal/dto/legal-authority-link-list-query.dto.example.ts";
import { legalAuthorityLinkResponseExample } from "#/modules/legal/dto/legal-authority-link-response.dto.example.ts";
import { legalAuthorityLinksListResponseExample } from "#/modules/legal/dto/legal-authority-links-list-response.dto.example.ts";
import { legalInstrumentListQueryExample } from "#/modules/legal/dto/legal-instrument-list-query.dto.example.ts";
import { legalInstrumentResponseExample } from "#/modules/legal/dto/legal-instrument-response.dto.example.ts";
import { legalInstrumentsListResponseExample } from "#/modules/legal/dto/legal-instruments-list-response.dto.example.ts";
import { legalProvisionListQueryExample } from "#/modules/legal/dto/legal-provision-list-query.dto.example.ts";
import { legalProvisionResponseExample } from "#/modules/legal/dto/legal-provision-response.dto.example.ts";
import { legalProvisionsListResponseExample } from "#/modules/legal/dto/legal-provisions-list-response.dto.example.ts";

import { HttpValidationPipe, httpOptions } from "#/server/http.options.ts";
import { LegalLegalReadModule } from "#/modules/legal/legal-read/legal-read.module.ts";
import { LegalLegalReadService } from "#/modules/legal/legal-read/legal-read.service.ts";

/**
 * Managed by Dryv: the Legal Read HTTP surface behaves as its contract says. The
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
  findLegalAmendmentChanges: vi.fn(),
  findLegalAmendments: vi.fn(),
  findLegalAuthorityLinks: vi.fn(),
  findLegalInstruments: vi.fn(),
  findLegalProvisions: vi.fn(),
  getLegalAmendmentById: vi.fn(),
  getLegalAmendmentChangeById: vi.fn(),
  getLegalAuthorityLinkById: vi.fn(),
  getLegalInstrumentById: vi.fn(),
  getLegalProvisionById: vi.fn(),
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
    imports: [InMemoryDataSourceModule, LegalLegalReadModule],
  })
    .overrideProvider(LegalLegalReadService)
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

describe("GET /v1/legal/amendment-changes (findLegalAmendmentChanges)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(legalAmendmentChangeListQueryExample.valid()), },
        headers: { },
      };
    const result = legalAmendmentChangesListResponseExample.valid();
    service.findLegalAmendmentChanges.mockResolvedValue(result);

    const response = await send("GET", "/v1/legal/amendment-changes", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findLegalAmendmentChanges).toHaveBeenCalledTimes(1);
    expect(service.findLegalAmendmentChanges).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/legal/amendments (findLegalAmendments)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(legalAmendmentListQueryExample.valid()), },
        headers: { },
      };
    const result = legalAmendmentsListResponseExample.valid();
    service.findLegalAmendments.mockResolvedValue(result);

    const response = await send("GET", "/v1/legal/amendments", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findLegalAmendments).toHaveBeenCalledTimes(1);
    expect(service.findLegalAmendments).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/legal/authority-links (findLegalAuthorityLinks)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(legalAuthorityLinkListQueryExample.valid()), },
        headers: { },
      };
    const result = legalAuthorityLinksListResponseExample.valid();
    service.findLegalAuthorityLinks.mockResolvedValue(result);

    const response = await send("GET", "/v1/legal/authority-links", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findLegalAuthorityLinks).toHaveBeenCalledTimes(1);
    expect(service.findLegalAuthorityLinks).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/legal/instruments (findLegalInstruments)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(legalInstrumentListQueryExample.valid()), },
        headers: { },
      };
    const result = legalInstrumentsListResponseExample.valid();
    service.findLegalInstruments.mockResolvedValue(result);

    const response = await send("GET", "/v1/legal/instruments", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findLegalInstruments).toHaveBeenCalledTimes(1);
    expect(service.findLegalInstruments).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/legal/provisions (findLegalProvisions)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(legalProvisionListQueryExample.valid()), },
        headers: { },
      };
    const result = legalProvisionsListResponseExample.valid();
    service.findLegalProvisions.mockResolvedValue(result);

    const response = await send("GET", "/v1/legal/provisions", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findLegalProvisions).toHaveBeenCalledTimes(1);
    expect(service.findLegalProvisions).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/legal/amendments/{amendmentId} (getLegalAmendmentById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "amendmentId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = legalAmendmentResponseExample.valid();
    service.getLegalAmendmentById.mockResolvedValue(result);

    const response = await send("GET", "/v1/legal/amendments/{amendmentId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getLegalAmendmentById).toHaveBeenCalledTimes(1);
    expect(service.getLegalAmendmentById).toHaveBeenCalledWith(expect.objectContaining({ amendmentId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/legal/amendment-changes/{changeId} (getLegalAmendmentChangeById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "changeId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = legalAmendmentChangeResponseExample.valid();
    service.getLegalAmendmentChangeById.mockResolvedValue(result);

    const response = await send("GET", "/v1/legal/amendment-changes/{changeId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getLegalAmendmentChangeById).toHaveBeenCalledTimes(1);
    expect(service.getLegalAmendmentChangeById).toHaveBeenCalledWith(expect.objectContaining({ changeId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/legal/authority-links/{linkId} (getLegalAuthorityLinkById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "linkId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = legalAuthorityLinkResponseExample.valid();
    service.getLegalAuthorityLinkById.mockResolvedValue(result);

    const response = await send("GET", "/v1/legal/authority-links/{linkId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getLegalAuthorityLinkById).toHaveBeenCalledTimes(1);
    expect(service.getLegalAuthorityLinkById).toHaveBeenCalledWith(expect.objectContaining({ linkId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/legal/instruments/{instrumentId} (getLegalInstrumentById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "instrumentId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = legalInstrumentResponseExample.valid();
    service.getLegalInstrumentById.mockResolvedValue(result);

    const response = await send("GET", "/v1/legal/instruments/{instrumentId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getLegalInstrumentById).toHaveBeenCalledTimes(1);
    expect(service.getLegalInstrumentById).toHaveBeenCalledWith(expect.objectContaining({ instrumentId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/legal/provisions/{provisionId} (getLegalProvisionById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "provisionId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = legalProvisionResponseExample.valid();
    service.getLegalProvisionById.mockResolvedValue(result);

    const response = await send("GET", "/v1/legal/provisions/{provisionId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getLegalProvisionById).toHaveBeenCalledTimes(1);
    expect(service.getLegalProvisionById).toHaveBeenCalledWith(expect.objectContaining({ provisionId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});