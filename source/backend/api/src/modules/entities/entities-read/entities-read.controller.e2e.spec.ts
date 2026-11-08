import "reflect-metadata";

import { Global, type INestApplication, Module } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { getDataSourceToken } from "@nestjs/typeorm";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { entityIdentifierListQueryExample } from "#/modules/entities/dto/entity-identifier-list-query.dto.example.ts";
import { entityIdentifierResponseExample } from "#/modules/entities/dto/entity-identifier-response.dto.example.ts";
import { entityIdentifiersListResponseExample } from "#/modules/entities/dto/entity-identifiers-list-response.dto.example.ts";
import { entityOwnershipListQueryExample } from "#/modules/entities/dto/entity-ownership-list-query.dto.example.ts";
import { entityOwnershipResponseExample } from "#/modules/entities/dto/entity-ownership-response.dto.example.ts";
import { entityOwnershipsListResponseExample } from "#/modules/entities/dto/entity-ownerships-list-response.dto.example.ts";
import { legalEntitiesListResponseExample } from "#/modules/entities/dto/legal-entities-list-response.dto.example.ts";
import { legalEntityListQueryExample } from "#/modules/entities/dto/legal-entity-list-query.dto.example.ts";
import { legalEntityResponseExample } from "#/modules/entities/dto/legal-entity-response.dto.example.ts";

import { HttpValidationPipe, httpOptions } from "#/server/http.options.ts";
import { EntitiesEntitiesReadModule } from "#/modules/entities/entities-read/entities-read.module.ts";
import { EntitiesEntitiesReadService } from "#/modules/entities/entities-read/entities-read.service.ts";

/**
 * Managed by Dryv: the Entities Read HTTP surface behaves as its contract says. The
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
  findEntityIdentifiers: vi.fn(),
  findEntityOwnerships: vi.fn(),
  findLegalEntities: vi.fn(),
  getEntityIdentifierById: vi.fn(),
  getEntityOwnershipById: vi.fn(),
  getLegalEntityById: vi.fn(),
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
    imports: [InMemoryDataSourceModule, EntitiesEntitiesReadModule],
  })
    .overrideProvider(EntitiesEntitiesReadService)
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

describe("GET /v1/entities/identifiers (findEntityIdentifiers)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(entityIdentifierListQueryExample.valid()), },
        headers: { },
      };
    const result = entityIdentifiersListResponseExample.valid();
    service.findEntityIdentifiers.mockResolvedValue(result);

    const response = await send("GET", "/v1/entities/identifiers", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findEntityIdentifiers).toHaveBeenCalledTimes(1);
    expect(service.findEntityIdentifiers).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/entities/ownerships (findEntityOwnerships)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(entityOwnershipListQueryExample.valid()), },
        headers: { },
      };
    const result = entityOwnershipsListResponseExample.valid();
    service.findEntityOwnerships.mockResolvedValue(result);

    const response = await send("GET", "/v1/entities/ownerships", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findEntityOwnerships).toHaveBeenCalledTimes(1);
    expect(service.findEntityOwnerships).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/entities/legal-entities (findLegalEntities)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(legalEntityListQueryExample.valid()), },
        headers: { },
      };
    const result = legalEntitiesListResponseExample.valid();
    service.findLegalEntities.mockResolvedValue(result);

    const response = await send("GET", "/v1/entities/legal-entities", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findLegalEntities).toHaveBeenCalledTimes(1);
    expect(service.findLegalEntities).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/entities/identifiers/{identifierId} (getEntityIdentifierById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "identifierId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = entityIdentifierResponseExample.valid();
    service.getEntityIdentifierById.mockResolvedValue(result);

    const response = await send("GET", "/v1/entities/identifiers/{identifierId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getEntityIdentifierById).toHaveBeenCalledTimes(1);
    expect(service.getEntityIdentifierById).toHaveBeenCalledWith(expect.objectContaining({ identifierId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/entities/ownerships/{ownershipId} (getEntityOwnershipById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "ownershipId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = entityOwnershipResponseExample.valid();
    service.getEntityOwnershipById.mockResolvedValue(result);

    const response = await send("GET", "/v1/entities/ownerships/{ownershipId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getEntityOwnershipById).toHaveBeenCalledTimes(1);
    expect(service.getEntityOwnershipById).toHaveBeenCalledWith(expect.objectContaining({ ownershipId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/entities/legal-entities/{entityId} (getLegalEntityById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "entityId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = legalEntityResponseExample.valid();
    service.getLegalEntityById.mockResolvedValue(result);

    const response = await send("GET", "/v1/entities/legal-entities/{entityId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getLegalEntityById).toHaveBeenCalledTimes(1);
    expect(service.getLegalEntityById).toHaveBeenCalledWith(expect.objectContaining({ entityId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});