import "reflect-metadata";

import { Global, type INestApplication, Module } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { getDataSourceToken } from "@nestjs/typeorm";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { bootstrapInputExample } from "@test/modules/explorer/schema/dto/examples/bootstrap-input.dto.example.ts";
import { bootstrapExample } from "@test/modules/explorer/schema/dto/examples/bootstrap.dto.example.ts";
import { childrenInputExample } from "@test/modules/explorer/schema/dto/examples/children-input.dto.example.ts";
import { contextExample } from "@test/modules/explorer/schema/dto/examples/context.dto.example.ts";
import { coordinatesInputExample } from "@test/modules/explorer/schema/dto/examples/coordinates-input.dto.example.ts";
import { copyBundleExample } from "@test/modules/explorer/schema/dto/examples/copy-bundle.dto.example.ts";
import { copyInputExample } from "@test/modules/explorer/schema/dto/examples/copy-input.dto.example.ts";
import { navigationInputExample } from "@test/modules/explorer/schema/dto/examples/navigation-input.dto.example.ts";
import { navigationExample } from "@test/modules/explorer/schema/dto/examples/navigation.dto.example.ts";
import { overviewExample } from "@test/modules/explorer/schema/dto/examples/overview.dto.example.ts";
import { placeInputExample } from "@test/modules/explorer/schema/dto/examples/place-input.dto.example.ts";
import { placesExample } from "@test/modules/explorer/schema/dto/examples/places.dto.example.ts";
import { resolutionExample } from "@test/modules/explorer/schema/dto/examples/resolution.dto.example.ts";
import { searchInputExample } from "@test/modules/explorer/schema/dto/examples/search-input.dto.example.ts";

import { HttpValidationPipe, httpOptions } from "#/server/http.options.ts";
import { ExplorerExplorerModule } from "#/modules/explorer/features/explorer/explorer.module.ts";
import { ExplorerExplorerService } from "#/modules/explorer/features/explorer/explorer.service.ts";

/**
 * Managed by Dryv: the Explorer HTTP surface behaves as its contract says. The
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
  getCopyBundle: vi.fn(),
  getExplorerContext: vi.fn(),
  getExplorerNavigation: vi.fn(),
  getExplorerOverview: vi.fn(),
  getSetupBootstrap: vi.fn(),
  listExplorerChildren: vi.fn(),
  resolveExplorerCoordinates: vi.fn(),
  searchExplorerPlaces: vi.fn(),
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
    imports: [InMemoryDataSourceModule, ExplorerExplorerModule],
  })
    .overrideProvider(ExplorerExplorerService)
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

describe("GET /v1/explorer/copy (getCopyBundle)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: {},
      query: { ...queryOf(copyInputExample.valid()) },
      headers: {},
    };
    const result = copyBundleExample.valid();
    service.getCopyBundle.mockResolvedValue(result);

    const response = await send("GET", "/v1/explorer/copy", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getCopyBundle).toHaveBeenCalledTimes(1);
    expect(service.getCopyBundle).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/explorer/context (getExplorerContext)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: {},
      query: { ...queryOf(placeInputExample.valid()) },
      headers: {},
    };
    const result = contextExample.valid();
    service.getExplorerContext.mockResolvedValue(result);

    const response = await send("GET", "/v1/explorer/context", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getExplorerContext).toHaveBeenCalledTimes(1);
    expect(service.getExplorerContext).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/explorer/navigation (getExplorerNavigation)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: {},
      query: { ...queryOf(navigationInputExample.valid()) },
      headers: {},
    };
    const result = navigationExample.valid();
    service.getExplorerNavigation.mockResolvedValue(result);

    const response = await send("GET", "/v1/explorer/navigation", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getExplorerNavigation).toHaveBeenCalledTimes(1);
    expect(service.getExplorerNavigation).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/explorer/overview (getExplorerOverview)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: {},
      query: { ...queryOf(placeInputExample.valid()) },
      headers: {},
    };
    const result = overviewExample.valid();
    service.getExplorerOverview.mockResolvedValue(result);

    const response = await send("GET", "/v1/explorer/overview", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getExplorerOverview).toHaveBeenCalledTimes(1);
    expect(service.getExplorerOverview).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/explorer/setup (getSetupBootstrap)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: {},
      query: { ...queryOf(bootstrapInputExample.valid()) },
      headers: {},
    };
    const result = bootstrapExample.valid();
    service.getSetupBootstrap.mockResolvedValue(result);

    const response = await send("GET", "/v1/explorer/setup", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getSetupBootstrap).toHaveBeenCalledTimes(1);
    expect(service.getSetupBootstrap).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/explorer/children (listExplorerChildren)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: {},
      query: { ...queryOf(childrenInputExample.valid()) },
      headers: {},
    };
    const result = placesExample.valid();
    service.listExplorerChildren.mockResolvedValue(result);

    const response = await send("GET", "/v1/explorer/children", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.listExplorerChildren).toHaveBeenCalledTimes(1);
    expect(service.listExplorerChildren).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("POST /v1/explorer/resolve (resolveExplorerCoordinates)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: {},
      query: {},
      headers: {},
      body: coordinatesInputExample.valid(),
    };
    const result = resolutionExample.valid();
    service.resolveExplorerCoordinates.mockResolvedValue(result);

    const response = await send("POST", "/v1/explorer/resolve", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.resolveExplorerCoordinates).toHaveBeenCalledTimes(1);
    expect(service.resolveExplorerCoordinates).toHaveBeenCalledWith(
      expect.objectContaining(sent.body),
    );
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });

  it("rejects an invalid body without calling the service", async () => {
    const [violation] = coordinatesInputExample.violations();
    if (violation === undefined) return;
    const sent: Sent = {
      ...{
        params: {},
        query: {},
        headers: {},
        body: coordinatesInputExample.valid(),
      },
      body: violation.value,
    };

    const response = await send("POST", "/v1/explorer/resolve", sent);

    expect(response.status).toBe(400);
    expect(service.resolveExplorerCoordinates).not.toHaveBeenCalled();
  });
});

describe("GET /v1/explorer/search (searchExplorerPlaces)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: {},
      query: { ...queryOf(searchInputExample.valid()) },
      headers: {},
    };
    const result = placesExample.valid();
    service.searchExplorerPlaces.mockResolvedValue(result);

    const response = await send("GET", "/v1/explorer/search", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.searchExplorerPlaces).toHaveBeenCalledTimes(1);
    expect(service.searchExplorerPlaces).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});
