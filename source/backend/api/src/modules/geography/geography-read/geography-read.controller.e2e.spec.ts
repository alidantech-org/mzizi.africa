import "reflect-metadata";

import { Global, type INestApplication, Module } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { getDataSourceToken } from "@nestjs/typeorm";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { geoUnitResponseExample } from "#/modules/geography/dto/geo-unit-response.dto.example.ts";
import { geographyBoundariesQueryExample } from "#/modules/geography/dto/geography-boundaries-query.dto.example.ts";
import { geographyEntityExample } from "#/modules/geography/dto/geography-entity.dto.example.ts";
import { geographyFeatureResponseExample } from "#/modules/geography/dto/geography-feature-response.dto.example.ts";
import { geographyHierarchyResponseExample } from "#/modules/geography/dto/geography-hierarchy-response.dto.example.ts";
import { geographyHistoryResponseExample } from "#/modules/geography/dto/geography-history-response.dto.example.ts";
import { geographyMapContextResponseExample } from "#/modules/geography/dto/geography-map-context-response.dto.example.ts";
import { geographySearchQueryExample } from "#/modules/geography/dto/geography-search-query.dto.example.ts";
import { geographySearchResponseExample } from "#/modules/geography/dto/geography-search-response.dto.example.ts";

import { HttpValidationPipe, httpOptions } from "#/server/http.options.ts";
import { GeographyGeographyReadModule } from "#/modules/geography/geography-read/geography-read.module.ts";
import { GeographyGeographyReadService } from "#/modules/geography/geography-read/geography-read.service.ts";

/**
 * Managed by Dryv: the Geography Read HTTP surface behaves as its contract says. The
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
  getChildBoundaries: vi.fn(),
  getGeoUnitById: vi.fn(),
  getGeographyBoundary: vi.fn(),
  getGeographyEntity: vi.fn(),
  getGeographyHierarchy: vi.fn(),
  getGeographyHistory: vi.fn(),
  getGeographyMapContext: vi.fn(),
  listBoundariesByLevel: vi.fn(),
  searchGeography: vi.fn(),
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
    imports: [InMemoryDataSourceModule, GeographyGeographyReadModule],
  })
    .overrideProvider(GeographyGeographyReadService)
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

describe("GET /v1/geography/entities/{entityId}/children/boundaries (getChildBoundaries)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "entityId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = geographyFeatureResponseExample.valid();
    service.getChildBoundaries.mockResolvedValue(result);

    const response = await send("GET", "/v1/geography/entities/{entityId}/children/boundaries", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getChildBoundaries).toHaveBeenCalledTimes(1);
    expect(service.getChildBoundaries).toHaveBeenCalledWith(expect.objectContaining({ entityId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/geography/units/{unitId} (getGeoUnitById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "unitId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = geoUnitResponseExample.valid();
    service.getGeoUnitById.mockResolvedValue(result);

    const response = await send("GET", "/v1/geography/units/{unitId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getGeoUnitById).toHaveBeenCalledTimes(1);
    expect(service.getGeoUnitById).toHaveBeenCalledWith(expect.objectContaining({ unitId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/geography/entities/{entityId}/boundary (getGeographyBoundary)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "entityId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = geographyFeatureResponseExample.valid();
    service.getGeographyBoundary.mockResolvedValue(result);

    const response = await send("GET", "/v1/geography/entities/{entityId}/boundary", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getGeographyBoundary).toHaveBeenCalledTimes(1);
    expect(service.getGeographyBoundary).toHaveBeenCalledWith(expect.objectContaining({ entityId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/geography/entities/{entityId} (getGeographyEntity)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "entityId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = geographyEntityExample.valid();
    service.getGeographyEntity.mockResolvedValue(result);

    const response = await send("GET", "/v1/geography/entities/{entityId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getGeographyEntity).toHaveBeenCalledTimes(1);
    expect(service.getGeographyEntity).toHaveBeenCalledWith(expect.objectContaining({ entityId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/geography/entities/{entityId}/hierarchy (getGeographyHierarchy)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "entityId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = geographyHierarchyResponseExample.valid();
    service.getGeographyHierarchy.mockResolvedValue(result);

    const response = await send("GET", "/v1/geography/entities/{entityId}/hierarchy", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getGeographyHierarchy).toHaveBeenCalledTimes(1);
    expect(service.getGeographyHierarchy).toHaveBeenCalledWith(expect.objectContaining({ entityId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/geography/entities/{entityId}/history (getGeographyHistory)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "entityId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = geographyHistoryResponseExample.valid();
    service.getGeographyHistory.mockResolvedValue(result);

    const response = await send("GET", "/v1/geography/entities/{entityId}/history", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getGeographyHistory).toHaveBeenCalledTimes(1);
    expect(service.getGeographyHistory).toHaveBeenCalledWith(expect.objectContaining({ entityId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/geography/entities/{entityId}/map-context (getGeographyMapContext)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "entityId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = geographyMapContextResponseExample.valid();
    service.getGeographyMapContext.mockResolvedValue(result);

    const response = await send("GET", "/v1/geography/entities/{entityId}/map-context", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getGeographyMapContext).toHaveBeenCalledTimes(1);
    expect(service.getGeographyMapContext).toHaveBeenCalledWith(expect.objectContaining({ entityId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/geography/boundaries (listBoundariesByLevel)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(geographyBoundariesQueryExample.valid()), },
        headers: { },
      };
    const result = geographyFeatureResponseExample.valid();
    service.listBoundariesByLevel.mockResolvedValue(result);

    const response = await send("GET", "/v1/geography/boundaries", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.listBoundariesByLevel).toHaveBeenCalledTimes(1);
    expect(service.listBoundariesByLevel).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/geography/search (searchGeography)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(geographySearchQueryExample.valid()), },
        headers: { },
      };
    const result = geographySearchResponseExample.valid();
    service.searchGeography.mockResolvedValue(result);

    const response = await send("GET", "/v1/geography/search", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.searchGeography).toHaveBeenCalledTimes(1);
    expect(service.searchGeography).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});