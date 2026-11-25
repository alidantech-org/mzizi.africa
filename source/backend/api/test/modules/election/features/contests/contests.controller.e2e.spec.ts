import "reflect-metadata";

import { Global, type INestApplication, Module } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { getDataSourceToken } from "@nestjs/typeorm";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { countryElectionsExample } from "@test/modules/election/schema/dto/examples/country-elections.dto.example.ts";
import { electionCollectionExample } from "@test/modules/election/schema/dto/examples/election-collection.dto.example.ts";
import { electionDetailExample } from "@test/modules/election/schema/dto/examples/election-detail.dto.example.ts";
import { electionKeyExample } from "@test/modules/election/schema/dto/examples/election-key.dto.example.ts";
import { placeTalliesExample } from "@test/modules/election/schema/dto/examples/place-tallies.dto.example.ts";
import { tallyCollectionExample } from "@test/modules/election/schema/dto/examples/tally-collection.dto.example.ts";

import { HttpValidationPipe, httpOptions } from "#/server/http.options.ts";
import { ElectionContestsModule } from "#/modules/election/features/contests/contests.module.ts";
import { ElectionContestsService } from "#/modules/election/features/contests/contests.service.ts";

/**
 * Managed by Dryv: the Contests HTTP surface behaves as its contract says. The
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
  getElection: vi.fn(),
  listElections: vi.fn(),
  listTallies: vi.fn(),
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
    imports: [InMemoryDataSourceModule, ElectionContestsModule],
  })
    .overrideProvider(ElectionContestsService)
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

describe("GET /v1/election/elections/{code} (getElection)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: { code: "value" },
      query: {},
      headers: {},
    };
    const result = electionDetailExample.valid();
    service.getElection.mockResolvedValue(result);

    const response = await send("GET", "/v1/election/elections/{code}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getElection).toHaveBeenCalledTimes(1);
    expect(service.getElection).toHaveBeenCalledWith(
      expect.objectContaining({ code: String("value") }),
    );
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/election/elections (listElections)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: {},
      query: { ...queryOf(countryElectionsExample.valid()) },
      headers: {},
    };
    const result = electionCollectionExample.valid();
    service.listElections.mockResolvedValue(result);

    const response = await send("GET", "/v1/election/elections", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.listElections).toHaveBeenCalledTimes(1);
    expect(service.listElections).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/election/tallies (listTallies)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: {},
      query: { ...queryOf(placeTalliesExample.valid()) },
      headers: {},
    };
    const result = tallyCollectionExample.valid();
    service.listTallies.mockResolvedValue(result);

    const response = await send("GET", "/v1/election/tallies", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.listTallies).toHaveBeenCalledTimes(1);
    expect(service.listTallies).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});
