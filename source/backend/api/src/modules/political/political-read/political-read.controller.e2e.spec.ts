import "reflect-metadata";

import { Global, type INestApplication, Module } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { getDataSourceToken } from "@nestjs/typeorm";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { ideologiesListResponseExample } from "#/modules/political/dto/ideologies-list-response.dto.example.ts";
import { ideologyListQueryExample } from "#/modules/political/dto/ideology-list-query.dto.example.ts";
import { ideologyResponseExample } from "#/modules/political/dto/ideology-response.dto.example.ts";
import { partiesListResponseExample } from "#/modules/political/dto/parties-list-response.dto.example.ts";
import { partyIdeologiesListResponseExample } from "#/modules/political/dto/party-ideologies-list-response.dto.example.ts";
import { partyIdeologyListQueryExample } from "#/modules/political/dto/party-ideology-list-query.dto.example.ts";
import { partyIdeologyResponseExample } from "#/modules/political/dto/party-ideology-response.dto.example.ts";
import { partyListQueryExample } from "#/modules/political/dto/party-list-query.dto.example.ts";
import { partyMembershipListQueryExample } from "#/modules/political/dto/party-membership-list-query.dto.example.ts";
import { partyMembershipResponseExample } from "#/modules/political/dto/party-membership-response.dto.example.ts";
import { partyMembershipsListResponseExample } from "#/modules/political/dto/party-memberships-list-response.dto.example.ts";
import { partyPositionHolderListQueryExample } from "#/modules/political/dto/party-position-holder-list-query.dto.example.ts";
import { partyPositionHolderResponseExample } from "#/modules/political/dto/party-position-holder-response.dto.example.ts";
import { partyPositionHoldersListResponseExample } from "#/modules/political/dto/party-position-holders-list-response.dto.example.ts";
import { partyPositionListQueryExample } from "#/modules/political/dto/party-position-list-query.dto.example.ts";
import { partyPositionResponseExample } from "#/modules/political/dto/party-position-response.dto.example.ts";
import { partyPositionsListResponseExample } from "#/modules/political/dto/party-positions-list-response.dto.example.ts";
import { partyResponseExample } from "#/modules/political/dto/party-response.dto.example.ts";
import { partyUnitListQueryExample } from "#/modules/political/dto/party-unit-list-query.dto.example.ts";
import { partyUnitResponseExample } from "#/modules/political/dto/party-unit-response.dto.example.ts";
import { partyUnitsListResponseExample } from "#/modules/political/dto/party-units-list-response.dto.example.ts";

import { HttpValidationPipe, httpOptions } from "#/server/http.options.ts";
import { PoliticalPoliticalReadModule } from "#/modules/political/political-read/political-read.module.ts";
import { PoliticalPoliticalReadService } from "#/modules/political/political-read/political-read.service.ts";

/**
 * Managed by Dryv: the Political Read HTTP surface behaves as its contract says. The
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
  findIdeologies: vi.fn(),
  findParties: vi.fn(),
  findPartyIdeologies: vi.fn(),
  findPartyMemberships: vi.fn(),
  findPartyPositionHolders: vi.fn(),
  findPartyPositions: vi.fn(),
  findPartyUnits: vi.fn(),
  getIdeologyById: vi.fn(),
  getPartyById: vi.fn(),
  getPartyIdeologyById: vi.fn(),
  getPartyMembershipById: vi.fn(),
  getPartyPositionById: vi.fn(),
  getPartyPositionHolderById: vi.fn(),
  getPartyUnitById: vi.fn(),
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
    imports: [InMemoryDataSourceModule, PoliticalPoliticalReadModule],
  })
    .overrideProvider(PoliticalPoliticalReadService)
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

describe("GET /v1/political/ideologies (findIdeologies)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(ideologyListQueryExample.valid()), },
        headers: { },
      };
    const result = ideologiesListResponseExample.valid();
    service.findIdeologies.mockResolvedValue(result);

    const response = await send("GET", "/v1/political/ideologies", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findIdeologies).toHaveBeenCalledTimes(1);
    expect(service.findIdeologies).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/political/parties (findParties)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(partyListQueryExample.valid()), },
        headers: { },
      };
    const result = partiesListResponseExample.valid();
    service.findParties.mockResolvedValue(result);

    const response = await send("GET", "/v1/political/parties", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findParties).toHaveBeenCalledTimes(1);
    expect(service.findParties).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/political/party-ideologies (findPartyIdeologies)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(partyIdeologyListQueryExample.valid()), },
        headers: { },
      };
    const result = partyIdeologiesListResponseExample.valid();
    service.findPartyIdeologies.mockResolvedValue(result);

    const response = await send("GET", "/v1/political/party-ideologies", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findPartyIdeologies).toHaveBeenCalledTimes(1);
    expect(service.findPartyIdeologies).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/political/memberships (findPartyMemberships)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(partyMembershipListQueryExample.valid()), },
        headers: { },
      };
    const result = partyMembershipsListResponseExample.valid();
    service.findPartyMemberships.mockResolvedValue(result);

    const response = await send("GET", "/v1/political/memberships", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findPartyMemberships).toHaveBeenCalledTimes(1);
    expect(service.findPartyMemberships).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/political/position-holders (findPartyPositionHolders)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(partyPositionHolderListQueryExample.valid()), },
        headers: { },
      };
    const result = partyPositionHoldersListResponseExample.valid();
    service.findPartyPositionHolders.mockResolvedValue(result);

    const response = await send("GET", "/v1/political/position-holders", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findPartyPositionHolders).toHaveBeenCalledTimes(1);
    expect(service.findPartyPositionHolders).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/political/positions (findPartyPositions)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(partyPositionListQueryExample.valid()), },
        headers: { },
      };
    const result = partyPositionsListResponseExample.valid();
    service.findPartyPositions.mockResolvedValue(result);

    const response = await send("GET", "/v1/political/positions", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findPartyPositions).toHaveBeenCalledTimes(1);
    expect(service.findPartyPositions).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/political/units (findPartyUnits)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(partyUnitListQueryExample.valid()), },
        headers: { },
      };
    const result = partyUnitsListResponseExample.valid();
    service.findPartyUnits.mockResolvedValue(result);

    const response = await send("GET", "/v1/political/units", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findPartyUnits).toHaveBeenCalledTimes(1);
    expect(service.findPartyUnits).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/political/ideologies/{ideologyId} (getIdeologyById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "ideologyId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = ideologyResponseExample.valid();
    service.getIdeologyById.mockResolvedValue(result);

    const response = await send("GET", "/v1/political/ideologies/{ideologyId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getIdeologyById).toHaveBeenCalledTimes(1);
    expect(service.getIdeologyById).toHaveBeenCalledWith(expect.objectContaining({ ideologyId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/political/parties/{partyId} (getPartyById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "partyId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = partyResponseExample.valid();
    service.getPartyById.mockResolvedValue(result);

    const response = await send("GET", "/v1/political/parties/{partyId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getPartyById).toHaveBeenCalledTimes(1);
    expect(service.getPartyById).toHaveBeenCalledWith(expect.objectContaining({ partyId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/political/party-ideologies/{partyIdeologyId} (getPartyIdeologyById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "partyIdeologyId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = partyIdeologyResponseExample.valid();
    service.getPartyIdeologyById.mockResolvedValue(result);

    const response = await send("GET", "/v1/political/party-ideologies/{partyIdeologyId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getPartyIdeologyById).toHaveBeenCalledTimes(1);
    expect(service.getPartyIdeologyById).toHaveBeenCalledWith(expect.objectContaining({ partyIdeologyId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/political/memberships/{membershipId} (getPartyMembershipById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "membershipId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = partyMembershipResponseExample.valid();
    service.getPartyMembershipById.mockResolvedValue(result);

    const response = await send("GET", "/v1/political/memberships/{membershipId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getPartyMembershipById).toHaveBeenCalledTimes(1);
    expect(service.getPartyMembershipById).toHaveBeenCalledWith(expect.objectContaining({ membershipId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/political/positions/{positionId} (getPartyPositionById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "positionId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = partyPositionResponseExample.valid();
    service.getPartyPositionById.mockResolvedValue(result);

    const response = await send("GET", "/v1/political/positions/{positionId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getPartyPositionById).toHaveBeenCalledTimes(1);
    expect(service.getPartyPositionById).toHaveBeenCalledWith(expect.objectContaining({ positionId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/political/position-holders/{holderId} (getPartyPositionHolderById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "holderId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = partyPositionHolderResponseExample.valid();
    service.getPartyPositionHolderById.mockResolvedValue(result);

    const response = await send("GET", "/v1/political/position-holders/{holderId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getPartyPositionHolderById).toHaveBeenCalledTimes(1);
    expect(service.getPartyPositionHolderById).toHaveBeenCalledWith(expect.objectContaining({ holderId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/political/units/{unitId} (getPartyUnitById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "unitId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = partyUnitResponseExample.valid();
    service.getPartyUnitById.mockResolvedValue(result);

    const response = await send("GET", "/v1/political/units/{unitId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getPartyUnitById).toHaveBeenCalledTimes(1);
    expect(service.getPartyUnitById).toHaveBeenCalledWith(expect.objectContaining({ unitId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});