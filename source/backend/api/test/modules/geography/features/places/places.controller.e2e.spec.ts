import "reflect-metadata";

import { Global, type INestApplication, Module } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { getDataSourceToken } from "@nestjs/typeorm";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { childCollectionExample } from "@test/modules/geography/schema/dto/examples/child-collection.dto.example.ts";
import { childWindowExample } from "@test/modules/geography/schema/dto/examples/child-window.dto.example.ts";
import { featureKeyExample } from "@test/modules/geography/schema/dto/examples/feature-key.dto.example.ts";
import { featureWindowExample } from "@test/modules/geography/schema/dto/examples/feature-window.dto.example.ts";
import { placeAtPointExample } from "@test/modules/geography/schema/dto/examples/place-at-point.dto.example.ts";
import { placeCollectionExample } from "@test/modules/geography/schema/dto/examples/place-collection.dto.example.ts";
import { placeDetailExample } from "@test/modules/geography/schema/dto/examples/place-detail.dto.example.ts";
import { pointQueryExample } from "@test/modules/geography/schema/dto/examples/point-query.dto.example.ts";

import { HttpValidationPipe, httpOptions } from "#/server/http.options.ts";
import { GeographyPlacesModule } from "#/modules/geography/features/places/places.module.ts";
import { GeographyPlacesService } from "#/modules/geography/features/places/places.service.ts";

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
  findPlacesAtPoint: vi.fn(),
  getPlace: vi.fn(),
  listChildren: vi.fn(),
  listPlaces: vi.fn(),
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
    imports: [InMemoryDataSourceModule, GeographyPlacesModule],
  })
    .overrideProvider(GeographyPlacesService)
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

describe("GET /v1/geography/at (findPlacesAtPoint)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: {},
      query: { ...queryOf(pointQueryExample.valid()) },
      headers: {},
    };
    const result = placeAtPointExample.valid();
    service.findPlacesAtPoint.mockResolvedValue(result);

    const response = await send("GET", "/v1/geography/at", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findPlacesAtPoint).toHaveBeenCalledTimes(1);
    expect(service.findPlacesAtPoint).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/geography/places/{code} (getPlace)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: { code: "value" },
      query: {},
      headers: {},
    };
    const result = placeDetailExample.valid();
    service.getPlace.mockResolvedValue(result);

    const response = await send("GET", "/v1/geography/places/{code}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getPlace).toHaveBeenCalledTimes(1);
    expect(service.getPlace).toHaveBeenCalledWith(
      expect.objectContaining({ code: String("value") }),
    );
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/geography/children (listChildren)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: {},
      query: { ...queryOf(childWindowExample.valid()) },
      headers: {},
    };
    const result = childCollectionExample.valid();
    service.listChildren.mockResolvedValue(result);

    const response = await send("GET", "/v1/geography/children", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.listChildren).toHaveBeenCalledTimes(1);
    expect(service.listChildren).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/geography/places (listPlaces)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: {},
      query: { ...queryOf(featureWindowExample.valid()) },
      headers: {},
    };
    const result = placeCollectionExample.valid();
    service.listPlaces.mockResolvedValue(result);

    const response = await send("GET", "/v1/geography/places", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.listPlaces).toHaveBeenCalledTimes(1);
    expect(service.listPlaces).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});
