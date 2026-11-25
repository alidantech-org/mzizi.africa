import "reflect-metadata";

import { Global, type INestApplication, Module } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { getDataSourceToken } from "@nestjs/typeorm";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { addressKeyExample } from "@test/modules/identity/schema/dto/examples/address-key.dto.example.ts";
import { addressMatchesExample } from "@test/modules/identity/schema/dto/examples/address-matches.dto.example.ts";
import { identityDetailExample } from "@test/modules/identity/schema/dto/examples/identity-detail.dto.example.ts";
import { identityKeyExample } from "@test/modules/identity/schema/dto/examples/identity-key.dto.example.ts";
import { nameMatchesExample } from "@test/modules/identity/schema/dto/examples/name-matches.dto.example.ts";
import { nameSearchExample } from "@test/modules/identity/schema/dto/examples/name-search.dto.example.ts";

import { HttpValidationPipe, httpOptions } from "#/server/http.options.ts";
import { IdentityThingsModule } from "#/modules/identity/features/things/things.module.ts";
import { IdentityThingsService } from "#/modules/identity/features/things/things.service.ts";

/**
 * Managed by Dryv: the Things HTTP surface behaves as its contract says. The
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
  getIdentity: vi.fn(),
  resolveAddress: vi.fn(),
  searchNames: vi.fn(),
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
    imports: [InMemoryDataSourceModule, IdentityThingsModule],
  })
    .overrideProvider(IdentityThingsService)
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

describe("GET /v1/identity/things/{code} (getIdentity)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: { code: "value" },
      query: {},
      headers: {},
    };
    const result = identityDetailExample.valid();
    service.getIdentity.mockResolvedValue(result);

    const response = await send("GET", "/v1/identity/things/{code}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getIdentity).toHaveBeenCalledTimes(1);
    expect(service.getIdentity).toHaveBeenCalledWith(
      expect.objectContaining({ code: String("value") }),
    );
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/identity/addresses (resolveAddress)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: {},
      query: { ...queryOf(addressKeyExample.valid()) },
      headers: {},
    };
    const result = addressMatchesExample.valid();
    service.resolveAddress.mockResolvedValue(result);

    const response = await send("GET", "/v1/identity/addresses", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.resolveAddress).toHaveBeenCalledTimes(1);
    expect(service.resolveAddress).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/identity/search (searchNames)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: {},
      query: { ...queryOf(nameSearchExample.valid()) },
      headers: {},
    };
    const result = nameMatchesExample.valid();
    service.searchNames.mockResolvedValue(result);

    const response = await send("GET", "/v1/identity/search", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.searchNames).toHaveBeenCalledTimes(1);
    expect(service.searchNames).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});
