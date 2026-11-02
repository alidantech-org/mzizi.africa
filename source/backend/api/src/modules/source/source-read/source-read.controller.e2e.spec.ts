import "reflect-metadata";

import { Global, type INestApplication, Module } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { getDataSourceToken } from "@nestjs/typeorm";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { attributionListQueryExample } from "#/modules/source/dto/attribution-list-query.dto.example.ts";
import { attributionResponseExample } from "#/modules/source/dto/attribution-response.dto.example.ts";
import { attributionsListResponseExample } from "#/modules/source/dto/attributions-list-response.dto.example.ts";
import { captureListQueryExample } from "#/modules/source/dto/capture-list-query.dto.example.ts";
import { captureResponseExample } from "#/modules/source/dto/capture-response.dto.example.ts";
import { capturesListResponseExample } from "#/modules/source/dto/captures-list-response.dto.example.ts";
import { documentListQueryExample } from "#/modules/source/dto/document-list-query.dto.example.ts";
import { documentResponseExample } from "#/modules/source/dto/document-response.dto.example.ts";
import { documentsListResponseExample } from "#/modules/source/dto/documents-list-response.dto.example.ts";
import { methodListQueryExample } from "#/modules/source/dto/method-list-query.dto.example.ts";
import { methodResponseExample } from "#/modules/source/dto/method-response.dto.example.ts";
import { methodsListResponseExample } from "#/modules/source/dto/methods-list-response.dto.example.ts";
import { publisherListQueryExample } from "#/modules/source/dto/publisher-list-query.dto.example.ts";
import { publisherResponseExample } from "#/modules/source/dto/publisher-response.dto.example.ts";
import { publishersListResponseExample } from "#/modules/source/dto/publishers-list-response.dto.example.ts";
import { verificationListQueryExample } from "#/modules/source/dto/verification-list-query.dto.example.ts";
import { verificationResponseExample } from "#/modules/source/dto/verification-response.dto.example.ts";
import { verificationsListResponseExample } from "#/modules/source/dto/verifications-list-response.dto.example.ts";

import { HttpValidationPipe, httpOptions } from "#/server/http.options.ts";
import { SourceSourceReadModule } from "#/modules/source/source-read/source-read.module.ts";
import { SourceSourceReadService } from "#/modules/source/source-read/source-read.service.ts";

/**
 * Managed by Dryv: the Source Read HTTP surface behaves as its contract says. The
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
  findAttributions: vi.fn(),
  findCaptures: vi.fn(),
  findDocuments: vi.fn(),
  findMethods: vi.fn(),
  findPublishers: vi.fn(),
  findVerifications: vi.fn(),
  getAttributionById: vi.fn(),
  getCaptureById: vi.fn(),
  getDocumentById: vi.fn(),
  getMethodById: vi.fn(),
  getPublisherById: vi.fn(),
  getVerificationById: vi.fn(),
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
    imports: [InMemoryDataSourceModule, SourceSourceReadModule],
  })
    .overrideProvider(SourceSourceReadService)
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

describe("GET /v1/source/attributions (findAttributions)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(attributionListQueryExample.valid()), },
        headers: { },
      };
    const result = attributionsListResponseExample.valid();
    service.findAttributions.mockResolvedValue(result);

    const response = await send("GET", "/v1/source/attributions", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findAttributions).toHaveBeenCalledTimes(1);
    expect(service.findAttributions).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/source/captures (findCaptures)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(captureListQueryExample.valid()), },
        headers: { },
      };
    const result = capturesListResponseExample.valid();
    service.findCaptures.mockResolvedValue(result);

    const response = await send("GET", "/v1/source/captures", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findCaptures).toHaveBeenCalledTimes(1);
    expect(service.findCaptures).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/source/documents (findDocuments)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(documentListQueryExample.valid()), },
        headers: { },
      };
    const result = documentsListResponseExample.valid();
    service.findDocuments.mockResolvedValue(result);

    const response = await send("GET", "/v1/source/documents", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findDocuments).toHaveBeenCalledTimes(1);
    expect(service.findDocuments).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/source/methods (findMethods)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(methodListQueryExample.valid()), },
        headers: { },
      };
    const result = methodsListResponseExample.valid();
    service.findMethods.mockResolvedValue(result);

    const response = await send("GET", "/v1/source/methods", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findMethods).toHaveBeenCalledTimes(1);
    expect(service.findMethods).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/source/publishers (findPublishers)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(publisherListQueryExample.valid()), },
        headers: { },
      };
    const result = publishersListResponseExample.valid();
    service.findPublishers.mockResolvedValue(result);

    const response = await send("GET", "/v1/source/publishers", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findPublishers).toHaveBeenCalledTimes(1);
    expect(service.findPublishers).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/source/verifications (findVerifications)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(verificationListQueryExample.valid()), },
        headers: { },
      };
    const result = verificationsListResponseExample.valid();
    service.findVerifications.mockResolvedValue(result);

    const response = await send("GET", "/v1/source/verifications", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findVerifications).toHaveBeenCalledTimes(1);
    expect(service.findVerifications).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/source/attributions/{attributionId} (getAttributionById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "attributionId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = attributionResponseExample.valid();
    service.getAttributionById.mockResolvedValue(result);

    const response = await send("GET", "/v1/source/attributions/{attributionId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getAttributionById).toHaveBeenCalledTimes(1);
    expect(service.getAttributionById).toHaveBeenCalledWith(expect.objectContaining({ attributionId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/source/captures/{captureId} (getCaptureById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "captureId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = captureResponseExample.valid();
    service.getCaptureById.mockResolvedValue(result);

    const response = await send("GET", "/v1/source/captures/{captureId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getCaptureById).toHaveBeenCalledTimes(1);
    expect(service.getCaptureById).toHaveBeenCalledWith(expect.objectContaining({ captureId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/source/documents/{documentId} (getDocumentById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "documentId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = documentResponseExample.valid();
    service.getDocumentById.mockResolvedValue(result);

    const response = await send("GET", "/v1/source/documents/{documentId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getDocumentById).toHaveBeenCalledTimes(1);
    expect(service.getDocumentById).toHaveBeenCalledWith(expect.objectContaining({ documentId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/source/methods/{methodId} (getMethodById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "methodId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = methodResponseExample.valid();
    service.getMethodById.mockResolvedValue(result);

    const response = await send("GET", "/v1/source/methods/{methodId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getMethodById).toHaveBeenCalledTimes(1);
    expect(service.getMethodById).toHaveBeenCalledWith(expect.objectContaining({ methodId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/source/publishers/{publisherId} (getPublisherById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "publisherId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = publisherResponseExample.valid();
    service.getPublisherById.mockResolvedValue(result);

    const response = await send("GET", "/v1/source/publishers/{publisherId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getPublisherById).toHaveBeenCalledTimes(1);
    expect(service.getPublisherById).toHaveBeenCalledWith(expect.objectContaining({ publisherId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/source/verifications/{verificationId} (getVerificationById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "verificationId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = verificationResponseExample.valid();
    service.getVerificationById.mockResolvedValue(result);

    const response = await send("GET", "/v1/source/verifications/{verificationId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getVerificationById).toHaveBeenCalledTimes(1);
    expect(service.getVerificationById).toHaveBeenCalledWith(expect.objectContaining({ verificationId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});