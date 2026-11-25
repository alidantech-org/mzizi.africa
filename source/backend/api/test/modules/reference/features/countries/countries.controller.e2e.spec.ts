import "reflect-metadata";

import { Global, type INestApplication, Module } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { getDataSourceToken } from "@nestjs/typeorm";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { countryCollectionExample } from "@test/modules/reference/schema/dto/examples/country-collection.dto.example.ts";
import { countryDetailExample } from "@test/modules/reference/schema/dto/examples/country-detail.dto.example.ts";
import { countryKeyExample } from "@test/modules/reference/schema/dto/examples/country-key.dto.example.ts";
import { referenceWindowExample } from "@test/modules/reference/schema/dto/examples/reference-window.dto.example.ts";

import { HttpValidationPipe, httpOptions } from "#/server/http.options.ts";
import { ReferenceCountriesModule } from "#/modules/reference/features/countries/countries.module.ts";
import { ReferenceCountriesService } from "#/modules/reference/features/countries/countries.service.ts";

/**
 * Managed by Dryv: the Countries HTTP surface behaves as its contract says. The
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
  getCountry: vi.fn(),
  listCountries: vi.fn(),
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
    imports: [InMemoryDataSourceModule, ReferenceCountriesModule],
  })
    .overrideProvider(ReferenceCountriesService)
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

describe("GET /v1/reference/countries/{code} (getCountry)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: { code: "value" },
      query: {},
      headers: {},
    };
    const result = countryDetailExample.valid();
    service.getCountry.mockResolvedValue(result);

    const response = await send("GET", "/v1/reference/countries/{code}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getCountry).toHaveBeenCalledTimes(1);
    expect(service.getCountry).toHaveBeenCalledWith(
      expect.objectContaining({ code: String("value") }),
    );
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/reference/countries (listCountries)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: {},
      query: { ...queryOf(referenceWindowExample.valid()) },
      headers: {},
    };
    const result = countryCollectionExample.valid();
    service.listCountries.mockResolvedValue(result);

    const response = await send("GET", "/v1/reference/countries", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.listCountries).toHaveBeenCalledTimes(1);
    expect(service.listCountries).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});
