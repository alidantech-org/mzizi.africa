import "reflect-metadata";

import { Global, type INestApplication, Module } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { getDataSourceToken } from "@nestjs/typeorm";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { classificationRecordListQueryExample } from "#/modules/reference/dto/classification-record-list-query.dto.example.ts";
import { classificationRecordResponseExample } from "#/modules/reference/dto/classification-record-response.dto.example.ts";
import { classificationRecordsListResponseExample } from "#/modules/reference/dto/classification-records-list-response.dto.example.ts";
import { jurisdictionListQueryExample } from "#/modules/reference/dto/jurisdiction-list-query.dto.example.ts";
import { jurisdictionResponseExample } from "#/modules/reference/dto/jurisdiction-response.dto.example.ts";
import { jurisdictionsListResponseExample } from "#/modules/reference/dto/jurisdictions-list-response.dto.example.ts";

import { HttpValidationPipe, httpOptions } from "#/server/http.options.ts";
import { ReferenceReferenceReadModule } from "#/modules/reference/reference-read/reference-read.module.ts";
import { ReferenceReferenceReadService } from "#/modules/reference/reference-read/reference-read.service.ts";

/**
 * Managed by Dryv: the Reference Read HTTP surface behaves as its contract says. The
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
  findClassificationRecords: vi.fn(),
  findJurisdictions: vi.fn(),
  getClassificationRecordById: vi.fn(),
  getJurisdictionById: vi.fn(),
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
    imports: [InMemoryDataSourceModule, ReferenceReferenceReadModule],
  })
    .overrideProvider(ReferenceReferenceReadService)
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

describe("GET /v1/reference/classification-records (findClassificationRecords)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(classificationRecordListQueryExample.valid()), },
        headers: { },
      };
    const result = classificationRecordsListResponseExample.valid();
    service.findClassificationRecords.mockResolvedValue(result);

    const response = await send("GET", "/v1/reference/classification-records", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findClassificationRecords).toHaveBeenCalledTimes(1);
    expect(service.findClassificationRecords).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/reference/jurisdictions (findJurisdictions)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(jurisdictionListQueryExample.valid()), },
        headers: { },
      };
    const result = jurisdictionsListResponseExample.valid();
    service.findJurisdictions.mockResolvedValue(result);

    const response = await send("GET", "/v1/reference/jurisdictions", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findJurisdictions).toHaveBeenCalledTimes(1);
    expect(service.findJurisdictions).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/reference/classification-records/{recordId} (getClassificationRecordById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "recordId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = classificationRecordResponseExample.valid();
    service.getClassificationRecordById.mockResolvedValue(result);

    const response = await send("GET", "/v1/reference/classification-records/{recordId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getClassificationRecordById).toHaveBeenCalledTimes(1);
    expect(service.getClassificationRecordById).toHaveBeenCalledWith(expect.objectContaining({ recordId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/reference/jurisdictions/{jurisdictionId} (getJurisdictionById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "jurisdictionId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = jurisdictionResponseExample.valid();
    service.getJurisdictionById.mockResolvedValue(result);

    const response = await send("GET", "/v1/reference/jurisdictions/{jurisdictionId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getJurisdictionById).toHaveBeenCalledTimes(1);
    expect(service.getJurisdictionById).toHaveBeenCalledWith(expect.objectContaining({ jurisdictionId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});