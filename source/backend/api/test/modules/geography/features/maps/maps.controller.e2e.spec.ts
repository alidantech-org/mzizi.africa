import "reflect-metadata";

import { Global, type INestApplication, Module } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { getDataSourceToken } from "@nestjs/typeorm";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { childOutlineCollectionExample } from "@test/modules/geography/schema/dto/examples/child-outline-collection.dto.example.ts";
import { childWindowExample } from "@test/modules/geography/schema/dto/examples/child-window.dto.example.ts";
import { outlineCollectionExample } from "@test/modules/geography/schema/dto/examples/outline-collection.dto.example.ts";
import { outlineWindowExample } from "@test/modules/geography/schema/dto/examples/outline-window.dto.example.ts";

import { HttpValidationPipe, httpOptions } from "#/server/http.options.ts";
import { GeographyMapsModule } from "#/modules/geography/features/maps/maps.module.ts";
import { GeographyMapsService } from "#/modules/geography/features/maps/maps.service.ts";

/**
 * Managed by Dryv: the Maps HTTP surface behaves as its contract says. The
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
  getOutline: vi.fn(),
  listChildOutlines: vi.fn(),
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
    imports: [InMemoryDataSourceModule, GeographyMapsModule],
  })
    .overrideProvider(GeographyMapsService)
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

describe("GET /v1/geography/outlines (getOutline)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: {},
      query: { ...queryOf(outlineWindowExample.valid()) },
      headers: {},
    };
    const result = outlineCollectionExample.valid();
    service.getOutline.mockResolvedValue(result);

    const response = await send("GET", "/v1/geography/outlines", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getOutline).toHaveBeenCalledTimes(1);
    expect(service.getOutline).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/geography/child-outlines (listChildOutlines)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: {},
      query: { ...queryOf(childWindowExample.valid()) },
      headers: {},
    };
    const result = childOutlineCollectionExample.valid();
    service.listChildOutlines.mockResolvedValue(result);

    const response = await send("GET", "/v1/geography/child-outlines", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.listChildOutlines).toHaveBeenCalledTimes(1);
    expect(service.listChildOutlines).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});
