import "reflect-metadata";

import { Global, type INestApplication, Module } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { getDataSourceToken } from "@nestjs/typeorm";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { citationInputExample } from "@test/modules/locality/schema/dto/examples/citation-input.dto.example.ts";
import { evidenceDetailExample } from "@test/modules/locality/schema/dto/examples/evidence-detail.dto.example.ts";
import { languageListExample } from "@test/modules/locality/schema/dto/examples/language-list.dto.example.ts";
import { localityMatchesExample } from "@test/modules/locality/schema/dto/examples/locality-matches.dto.example.ts";
import { localityProfileExample } from "@test/modules/locality/schema/dto/examples/locality-profile.dto.example.ts";
import { placeInputExample } from "@test/modules/locality/schema/dto/examples/place-input.dto.example.ts";
import { positionInputExample } from "@test/modules/locality/schema/dto/examples/position-input.dto.example.ts";
import { searchInputExample } from "@test/modules/locality/schema/dto/examples/search-input.dto.example.ts";
import { sourceCollectionExample } from "@test/modules/locality/schema/dto/examples/source-collection.dto.example.ts";
import { sourceSearchInputExample } from "@test/modules/locality/schema/dto/examples/source-search-input.dto.example.ts";

import { HttpValidationPipe, httpOptions } from "#/server/http.options.ts";
import { LocalityPlacesModule } from "#/modules/locality/features/places/places.module.ts";
import { LocalityPlacesService } from "#/modules/locality/features/places/places.service.ts";

/**
 * Managed by Dryv: the Places HTTP surface behaves as its contract says. The
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
  browseSources: vi.fn(),
  getEvidence: vi.fn(),
  getLocality: vi.fn(),
  listLanguages: vi.fn(),
  resolveLocality: vi.fn(),
  searchLocalities: vi.fn(),
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
    imports: [InMemoryDataSourceModule, LocalityPlacesModule],
  })
    .overrideProvider(LocalityPlacesService)
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

describe("GET /v1/sources (browseSources)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: {},
      query: { ...queryOf(sourceSearchInputExample.valid()) },
      headers: {},
    };
    const result = sourceCollectionExample.valid();
    service.browseSources.mockResolvedValue(result);

    const response = await send("GET", "/v1/sources", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.browseSources).toHaveBeenCalledTimes(1);
    expect(service.browseSources).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/evidence/{citationId} (getEvidence)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: { citationId: "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11" },
      query: {},
      headers: {},
    };
    const result = evidenceDetailExample.valid();
    service.getEvidence.mockResolvedValue(result);

    const response = await send("GET", "/v1/evidence/{citationId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getEvidence).toHaveBeenCalledTimes(1);
    expect(service.getEvidence).toHaveBeenCalledWith(
      expect.objectContaining({
        citationId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"),
      }),
    );
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/locality/{featureId} (getLocality)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: { featureId: "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11" },
      query: { languageCode: "value" },
      headers: {},
    };
    const result = localityProfileExample.valid();
    service.getLocality.mockResolvedValue(result);

    const response = await send("GET", "/v1/locality/{featureId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getLocality).toHaveBeenCalledTimes(1);
    expect(service.getLocality).toHaveBeenCalledWith(
      expect.objectContaining({
        featureId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"),
        languageCode: String("value"),
      }),
    );
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/languages (listLanguages)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: {},
      query: {},
      headers: {},
    };
    const result = languageListExample.valid();
    service.listLanguages.mockResolvedValue(result);

    const response = await send("GET", "/v1/languages", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.listLanguages).toHaveBeenCalledTimes(1);
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/locality/at (resolveLocality)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: {},
      query: { ...queryOf(positionInputExample.valid()) },
      headers: {},
    };
    const result = localityProfileExample.valid();
    service.resolveLocality.mockResolvedValue(result);

    const response = await send("GET", "/v1/locality/at", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.resolveLocality).toHaveBeenCalledTimes(1);
    expect(service.resolveLocality).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/locality/search (searchLocalities)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: {},
      query: { ...queryOf(searchInputExample.valid()) },
      headers: {},
    };
    const result = localityMatchesExample.valid();
    service.searchLocalities.mockResolvedValue(result);

    const response = await send("GET", "/v1/locality/search", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.searchLocalities).toHaveBeenCalledTimes(1);
    expect(service.searchLocalities).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});
