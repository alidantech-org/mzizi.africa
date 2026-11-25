import "reflect-metadata";

import { Global, type INestApplication, Module } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { getDataSourceToken } from "@nestjs/typeorm";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { copyBundleExample } from "@test/modules/frontend/schema/dto/examples/copy-bundle.dto.example.ts";
import { copyRequestExample } from "@test/modules/frontend/schema/dto/examples/copy-request.dto.example.ts";
import { homeRequestExample } from "@test/modules/frontend/schema/dto/examples/home-request.dto.example.ts";
import { homeScreenExample } from "@test/modules/frontend/schema/dto/examples/home-screen.dto.example.ts";
import { institutionRequestExample } from "@test/modules/frontend/schema/dto/examples/institution-request.dto.example.ts";
import { institutionScreenExample } from "@test/modules/frontend/schema/dto/examples/institution-screen.dto.example.ts";
import { placeRequestExample } from "@test/modules/frontend/schema/dto/examples/place-request.dto.example.ts";
import { placeScreenExample } from "@test/modules/frontend/schema/dto/examples/place-screen.dto.example.ts";
import { rankingRequestExample } from "@test/modules/frontend/schema/dto/examples/ranking-request.dto.example.ts";
import { rankingScreenExample } from "@test/modules/frontend/schema/dto/examples/ranking-screen.dto.example.ts";
import { searchRequestExample } from "@test/modules/frontend/schema/dto/examples/search-request.dto.example.ts";
import { searchResultsExample } from "@test/modules/frontend/schema/dto/examples/search-results.dto.example.ts";

import { HttpValidationPipe, httpOptions } from "#/server/http.options.ts";
import { FrontendScreensModule } from "#/modules/frontend/features/screens/screens.module.ts";
import { FrontendScreensService } from "#/modules/frontend/features/screens/screens.service.ts";

/**
 * Managed by Dryv: the Screens HTTP surface behaves as its contract says. The
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
  getHomeScreen: vi.fn(),
  getInstitutionScreen: vi.fn(),
  getPlaceScreen: vi.fn(),
  getRankingScreen: vi.fn(),
  searchScreen: vi.fn(),
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
    imports: [InMemoryDataSourceModule, FrontendScreensModule],
  })
    .overrideProvider(FrontendScreensService)
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

describe("GET /v1/frontend/copy (getCopyBundle)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: {},
      query: { ...queryOf(copyRequestExample.valid()) },
      headers: {},
    };
    const result = copyBundleExample.valid();
    service.getCopyBundle.mockResolvedValue(result);

    const response = await send("GET", "/v1/frontend/copy", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getCopyBundle).toHaveBeenCalledTimes(1);
    expect(service.getCopyBundle).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/frontend/home (getHomeScreen)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: {},
      query: { ...queryOf(homeRequestExample.valid()) },
      headers: {},
    };
    const result = homeScreenExample.valid();
    service.getHomeScreen.mockResolvedValue(result);

    const response = await send("GET", "/v1/frontend/home", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getHomeScreen).toHaveBeenCalledTimes(1);
    expect(service.getHomeScreen).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/frontend/institution (getInstitutionScreen)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: {},
      query: { ...queryOf(institutionRequestExample.valid()) },
      headers: {},
    };
    const result = institutionScreenExample.valid();
    service.getInstitutionScreen.mockResolvedValue(result);

    const response = await send("GET", "/v1/frontend/institution", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getInstitutionScreen).toHaveBeenCalledTimes(1);
    expect(service.getInstitutionScreen).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/frontend/place (getPlaceScreen)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: {},
      query: { ...queryOf(placeRequestExample.valid()) },
      headers: {},
    };
    const result = placeScreenExample.valid();
    service.getPlaceScreen.mockResolvedValue(result);

    const response = await send("GET", "/v1/frontend/place", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getPlaceScreen).toHaveBeenCalledTimes(1);
    expect(service.getPlaceScreen).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/frontend/ranking (getRankingScreen)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: {},
      query: { ...queryOf(rankingRequestExample.valid()) },
      headers: {},
    };
    const result = rankingScreenExample.valid();
    service.getRankingScreen.mockResolvedValue(result);

    const response = await send("GET", "/v1/frontend/ranking", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getRankingScreen).toHaveBeenCalledTimes(1);
    expect(service.getRankingScreen).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/frontend/search (searchScreen)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: {},
      query: { ...queryOf(searchRequestExample.valid()) },
      headers: {},
    };
    const result = searchResultsExample.valid();
    service.searchScreen.mockResolvedValue(result);

    const response = await send("GET", "/v1/frontend/search", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.searchScreen).toHaveBeenCalledTimes(1);
    expect(service.searchScreen).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});
