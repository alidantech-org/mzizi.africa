import "reflect-metadata";

import { Global, type INestApplication, Module } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { getDataSourceToken } from "@nestjs/typeorm";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { countryPartiesExample } from "@test/modules/politics/schema/dto/examples/country-parties.dto.example.ts";
import { partyCollectionExample } from "@test/modules/politics/schema/dto/examples/party-collection.dto.example.ts";
import { partyDetailExample } from "@test/modules/politics/schema/dto/examples/party-detail.dto.example.ts";
import { partyKeyExample } from "@test/modules/politics/schema/dto/examples/party-key.dto.example.ts";

import { HttpValidationPipe, httpOptions } from "#/server/http.options.ts";
import { PoliticsPartiesModule } from "#/modules/politics/features/parties/parties.module.ts";
import { PoliticsPartiesService } from "#/modules/politics/features/parties/parties.service.ts";

/**
 * Managed by Dryv: the Parties HTTP surface behaves as its contract says. The
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
  getParty: vi.fn(),
  listParties: vi.fn(),
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
    imports: [InMemoryDataSourceModule, PoliticsPartiesModule],
  })
    .overrideProvider(PoliticsPartiesService)
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

describe("GET /v1/politics/parties/{code} (getParty)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: { code: "value" },
      query: {},
      headers: {},
    };
    const result = partyDetailExample.valid();
    service.getParty.mockResolvedValue(result);

    const response = await send("GET", "/v1/politics/parties/{code}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getParty).toHaveBeenCalledTimes(1);
    expect(service.getParty).toHaveBeenCalledWith(
      expect.objectContaining({ code: String("value") }),
    );
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/politics/parties (listParties)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: {},
      query: { ...queryOf(countryPartiesExample.valid()) },
      headers: {},
    };
    const result = partyCollectionExample.valid();
    service.listParties.mockResolvedValue(result);

    const response = await send("GET", "/v1/politics/parties", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.listParties).toHaveBeenCalledTimes(1);
    expect(service.listParties).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});
