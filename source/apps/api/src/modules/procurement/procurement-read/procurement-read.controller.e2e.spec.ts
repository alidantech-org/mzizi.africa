import "reflect-metadata";

import { Global, type INestApplication, Module } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { getDataSourceToken } from "@nestjs/typeorm";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { bidListQueryExample } from "#/modules/procurement/dto/bid-list-query.dto.example.ts";
import { bidResponseExample } from "#/modules/procurement/dto/bid-response.dto.example.ts";
import { bidsListResponseExample } from "#/modules/procurement/dto/bids-list-response.dto.example.ts";
import { contractMilestoneListQueryExample } from "#/modules/procurement/dto/contract-milestone-list-query.dto.example.ts";
import { contractMilestoneResponseExample } from "#/modules/procurement/dto/contract-milestone-response.dto.example.ts";
import { contractMilestonesListResponseExample } from "#/modules/procurement/dto/contract-milestones-list-response.dto.example.ts";
import { contractVariationListQueryExample } from "#/modules/procurement/dto/contract-variation-list-query.dto.example.ts";
import { contractVariationResponseExample } from "#/modules/procurement/dto/contract-variation-response.dto.example.ts";
import { contractVariationsListResponseExample } from "#/modules/procurement/dto/contract-variations-list-response.dto.example.ts";
import { procurementContractListQueryExample } from "#/modules/procurement/dto/procurement-contract-list-query.dto.example.ts";
import { procurementContractResponseExample } from "#/modules/procurement/dto/procurement-contract-response.dto.example.ts";
import { procurementContractsListResponseExample } from "#/modules/procurement/dto/procurement-contracts-list-response.dto.example.ts";
import { tenderListQueryExample } from "#/modules/procurement/dto/tender-list-query.dto.example.ts";
import { tenderResponseExample } from "#/modules/procurement/dto/tender-response.dto.example.ts";
import { tendersListResponseExample } from "#/modules/procurement/dto/tenders-list-response.dto.example.ts";

import { HttpValidationPipe, httpOptions } from "#/server/http.options.ts";
import { ProcurementProcurementReadModule } from "#/modules/procurement/procurement-read/procurement-read.module.ts";
import { ProcurementProcurementReadService } from "#/modules/procurement/procurement-read/procurement-read.service.ts";

/**
 * Managed by Dryv: the Procurement Read HTTP surface behaves as its contract says. The
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
  findBids: vi.fn(),
  findContractMilestones: vi.fn(),
  findContractVariations: vi.fn(),
  findProcurementContracts: vi.fn(),
  findTenders: vi.fn(),
  getBidById: vi.fn(),
  getContractMilestoneById: vi.fn(),
  getContractVariationById: vi.fn(),
  getProcurementContractById: vi.fn(),
  getTenderById: vi.fn(),
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
    imports: [InMemoryDataSourceModule, ProcurementProcurementReadModule],
  })
    .overrideProvider(ProcurementProcurementReadService)
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

describe("GET /v1/procurement/bids (findBids)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(bidListQueryExample.valid()), },
        headers: { },
      };
    const result = bidsListResponseExample.valid();
    service.findBids.mockResolvedValue(result);

    const response = await send("GET", "/v1/procurement/bids", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findBids).toHaveBeenCalledTimes(1);
    expect(service.findBids).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/procurement/milestones (findContractMilestones)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(contractMilestoneListQueryExample.valid()), },
        headers: { },
      };
    const result = contractMilestonesListResponseExample.valid();
    service.findContractMilestones.mockResolvedValue(result);

    const response = await send("GET", "/v1/procurement/milestones", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findContractMilestones).toHaveBeenCalledTimes(1);
    expect(service.findContractMilestones).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/procurement/variations (findContractVariations)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(contractVariationListQueryExample.valid()), },
        headers: { },
      };
    const result = contractVariationsListResponseExample.valid();
    service.findContractVariations.mockResolvedValue(result);

    const response = await send("GET", "/v1/procurement/variations", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findContractVariations).toHaveBeenCalledTimes(1);
    expect(service.findContractVariations).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/procurement/contracts (findProcurementContracts)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(procurementContractListQueryExample.valid()), },
        headers: { },
      };
    const result = procurementContractsListResponseExample.valid();
    service.findProcurementContracts.mockResolvedValue(result);

    const response = await send("GET", "/v1/procurement/contracts", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findProcurementContracts).toHaveBeenCalledTimes(1);
    expect(service.findProcurementContracts).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/procurement/tenders (findTenders)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(tenderListQueryExample.valid()), },
        headers: { },
      };
    const result = tendersListResponseExample.valid();
    service.findTenders.mockResolvedValue(result);

    const response = await send("GET", "/v1/procurement/tenders", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findTenders).toHaveBeenCalledTimes(1);
    expect(service.findTenders).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/procurement/bids/{bidId} (getBidById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "bidId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = bidResponseExample.valid();
    service.getBidById.mockResolvedValue(result);

    const response = await send("GET", "/v1/procurement/bids/{bidId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getBidById).toHaveBeenCalledTimes(1);
    expect(service.getBidById).toHaveBeenCalledWith(expect.objectContaining({ bidId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/procurement/milestones/{milestoneId} (getContractMilestoneById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "milestoneId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = contractMilestoneResponseExample.valid();
    service.getContractMilestoneById.mockResolvedValue(result);

    const response = await send("GET", "/v1/procurement/milestones/{milestoneId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getContractMilestoneById).toHaveBeenCalledTimes(1);
    expect(service.getContractMilestoneById).toHaveBeenCalledWith(expect.objectContaining({ milestoneId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/procurement/variations/{variationId} (getContractVariationById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "variationId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = contractVariationResponseExample.valid();
    service.getContractVariationById.mockResolvedValue(result);

    const response = await send("GET", "/v1/procurement/variations/{variationId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getContractVariationById).toHaveBeenCalledTimes(1);
    expect(service.getContractVariationById).toHaveBeenCalledWith(expect.objectContaining({ variationId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/procurement/contracts/{contractId} (getProcurementContractById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "contractId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = procurementContractResponseExample.valid();
    service.getProcurementContractById.mockResolvedValue(result);

    const response = await send("GET", "/v1/procurement/contracts/{contractId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getProcurementContractById).toHaveBeenCalledTimes(1);
    expect(service.getProcurementContractById).toHaveBeenCalledWith(expect.objectContaining({ contractId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/procurement/tenders/{tenderId} (getTenderById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "tenderId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = tenderResponseExample.valid();
    service.getTenderById.mockResolvedValue(result);

    const response = await send("GET", "/v1/procurement/tenders/{tenderId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getTenderById).toHaveBeenCalledTimes(1);
    expect(service.getTenderById).toHaveBeenCalledWith(expect.objectContaining({ tenderId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});