import "reflect-metadata";

import { Global, type INestApplication, Module } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { getDataSourceToken } from "@nestjs/typeorm";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { budgetListExample } from "@test/modules/ledger/schema/dto/examples/budget-list.dto.example.ts";
import { coalitionListExample } from "@test/modules/ledger/schema/dto/examples/coalition-list.dto.example.ts";
import { coverageListExample } from "@test/modules/ledger/schema/dto/examples/coverage-list.dto.example.ts";
import { fundListExample } from "@test/modules/ledger/schema/dto/examples/fund-list.dto.example.ts";
import { ledgerInputExample } from "@test/modules/ledger/schema/dto/examples/ledger-input.dto.example.ts";
import { manifestoListExample } from "@test/modules/ledger/schema/dto/examples/manifesto-list.dto.example.ts";

import { HttpValidationPipe, httpOptions } from "#/server/http.options.ts";
import { LedgerLedgerModule } from "#/modules/ledger/features/ledger/ledger.module.ts";
import { LedgerLedgerService } from "#/modules/ledger/features/ledger/ledger.service.ts";

/**
 * Managed by Dryv: the Ledger HTTP surface behaves as its contract says. The
 * project implementation is replaced with mocks, so these specs check routing, input binding,
 * validation, status codes and response passthrough without business logic or a database.
 */

// Repositories resolve without a database; the mocked service never reaches them.
@Global()
@Module({
  providers: [
    {
      provide: getDataSourceToken(),
      useValue: {
        options: { type: "postgres" },
        entityMetadatas: [],
        getRepository: () => ({}),
      },
    },
  ],
  exports: [getDataSourceToken()],
})
class InMemoryDataSourceModule {}

const service = {
  getCoverage: vi.fn(),
  listBudgets: vi.fn(),
  listCoalitions: vi.fn(),
  listFunds: vi.fn(),
  listManifestos: vi.fn(),
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
    imports: [InMemoryDataSourceModule, LedgerLedgerModule],
  })
    .overrideProvider(LedgerLedgerService)
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
    Object.entries(value).filter(
      ([, item]) => item === null || typeof item !== "object" || Array.isArray(item),
    ),
  );
}

async function send(method: string, path: string, sent: Sent): Promise<Response> {
  const url = new URL(
    base +
      path.replace(/\{(\w+)\}/g, (_match, name: string) =>
        encodeURIComponent(String(sent.params[name])),
      ),
  );
  for (const [key, value] of Object.entries(sent.query)) {
    for (const item of Array.isArray(value) ? value : [value])
      url.searchParams.append(key, String(item));
  }
  return fetch(url, {
    method,
    headers: { "content-type": "application/json", ...sent.headers },
    body: sent.body === undefined ? undefined : JSON.stringify(sent.body),
  });
}

describe("GET /v1/coverage (getCoverage)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: {},
      query: {},
      headers: {},
    };
    const result = coverageListExample.valid();
    service.getCoverage.mockResolvedValue(result);

    const response = await send("GET", "/v1/coverage", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getCoverage).toHaveBeenCalledTimes(1);
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/budgets (listBudgets)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: {},
      query: { ...queryOf(ledgerInputExample.valid()) },
      headers: {},
    };
    const result = budgetListExample.valid();
    service.listBudgets.mockResolvedValue(result);

    const response = await send("GET", "/v1/budgets", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.listBudgets).toHaveBeenCalledTimes(1);
    expect(service.listBudgets).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/coalitions (listCoalitions)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: {},
      query: {},
      headers: {},
    };
    const result = coalitionListExample.valid();
    service.listCoalitions.mockResolvedValue(result);

    const response = await send("GET", "/v1/coalitions", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.listCoalitions).toHaveBeenCalledTimes(1);
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/funds (listFunds)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: {},
      query: { ...queryOf(ledgerInputExample.valid()) },
      headers: {},
    };
    const result = fundListExample.valid();
    service.listFunds.mockResolvedValue(result);

    const response = await send("GET", "/v1/funds", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.listFunds).toHaveBeenCalledTimes(1);
    expect(service.listFunds).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/manifestos (listManifestos)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: {},
      query: {},
      headers: {},
    };
    const result = manifestoListExample.valid();
    service.listManifestos.mockResolvedValue(result);

    const response = await send("GET", "/v1/manifestos", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.listManifestos).toHaveBeenCalledTimes(1);
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});
