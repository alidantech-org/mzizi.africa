import "reflect-metadata";

import { Global, type INestApplication, Module } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { getDataSourceToken } from "@nestjs/typeorm";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { billCollectionExample } from "@test/modules/legislature/schema/dto/examples/bill-collection.dto.example.ts";
import { billDetailExample } from "@test/modules/legislature/schema/dto/examples/bill-detail.dto.example.ts";
import { billKeyExample } from "@test/modules/legislature/schema/dto/examples/bill-key.dto.example.ts";
import { billWindowExample } from "@test/modules/legislature/schema/dto/examples/bill-window.dto.example.ts";
import { motionVotesExample } from "@test/modules/legislature/schema/dto/examples/motion-votes.dto.example.ts";
import { voteCollectionExample } from "@test/modules/legislature/schema/dto/examples/vote-collection.dto.example.ts";

import { HttpValidationPipe, httpOptions } from "#/server/http.options.ts";
import { LegislatureLawmakingModule } from "#/modules/legislature/features/lawmaking/lawmaking.module.ts";
import { LegislatureLawmakingService } from "#/modules/legislature/features/lawmaking/lawmaking.service.ts";

/**
 * Managed by Dryv: the Lawmaking HTTP surface behaves as its contract says. The
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
  getBill: vi.fn(),
  listBills: vi.fn(),
  listVotes: vi.fn(),
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
    imports: [InMemoryDataSourceModule, LegislatureLawmakingModule],
  })
    .overrideProvider(LegislatureLawmakingService)
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

describe("GET /v1/legislature/bills/{code} (getBill)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: { code: "value" },
      query: {},
      headers: {},
    };
    const result = billDetailExample.valid();
    service.getBill.mockResolvedValue(result);

    const response = await send("GET", "/v1/legislature/bills/{code}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getBill).toHaveBeenCalledTimes(1);
    expect(service.getBill).toHaveBeenCalledWith(
      expect.objectContaining({ code: String("value") }),
    );
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/legislature/bills (listBills)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: {},
      query: { ...queryOf(billWindowExample.valid()) },
      headers: {},
    };
    const result = billCollectionExample.valid();
    service.listBills.mockResolvedValue(result);

    const response = await send("GET", "/v1/legislature/bills", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.listBills).toHaveBeenCalledTimes(1);
    expect(service.listBills).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/legislature/votes (listVotes)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: {},
      query: { ...queryOf(motionVotesExample.valid()) },
      headers: {},
    };
    const result = voteCollectionExample.valid();
    service.listVotes.mockResolvedValue(result);

    const response = await send("GET", "/v1/legislature/votes", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.listVotes).toHaveBeenCalledTimes(1);
    expect(service.listVotes).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});
