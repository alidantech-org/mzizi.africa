import "reflect-metadata";

import { Global, type INestApplication, Module } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { getDataSourceToken } from "@nestjs/typeorm";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { figureCollectionExample } from "@test/modules/statistics/schema/dto/examples/figure-collection.dto.example.ts";
import { indicatorFigureCollectionExample } from "@test/modules/statistics/schema/dto/examples/indicator-figure-collection.dto.example.ts";
import { indicatorFiguresExample } from "@test/modules/statistics/schema/dto/examples/indicator-figures.dto.example.ts";
import { observationCollectionExample } from "@test/modules/statistics/schema/dto/examples/observation-collection.dto.example.ts";
import { observationScopeExample } from "@test/modules/statistics/schema/dto/examples/observation-scope.dto.example.ts";
import { placeFiguresExample } from "@test/modules/statistics/schema/dto/examples/place-figures.dto.example.ts";

import { HttpValidationPipe, httpOptions } from "#/server/http.options.ts";
import { StatisticsFiguresModule } from "#/modules/statistics/features/figures/figures.module.ts";
import { StatisticsFiguresService } from "#/modules/statistics/features/figures/figures.service.ts";

/**
 * Managed by Dryv: the Figures HTTP surface behaves as its contract says. The
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
  listIndicatorFigures: vi.fn(),
  listObservations: vi.fn(),
  listPlaceFigures: vi.fn(),
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
    imports: [InMemoryDataSourceModule, StatisticsFiguresModule],
  })
    .overrideProvider(StatisticsFiguresService)
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

describe("GET /v1/statistics/indicator-figures (listIndicatorFigures)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: {},
      query: { ...queryOf(indicatorFiguresExample.valid()) },
      headers: {},
    };
    const result = indicatorFigureCollectionExample.valid();
    service.listIndicatorFigures.mockResolvedValue(result);

    const response = await send("GET", "/v1/statistics/indicator-figures", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.listIndicatorFigures).toHaveBeenCalledTimes(1);
    expect(service.listIndicatorFigures).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/statistics/observations (listObservations)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: {},
      query: { ...queryOf(observationScopeExample.valid()) },
      headers: {},
    };
    const result = observationCollectionExample.valid();
    service.listObservations.mockResolvedValue(result);

    const response = await send("GET", "/v1/statistics/observations", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.listObservations).toHaveBeenCalledTimes(1);
    expect(service.listObservations).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/statistics/figures (listPlaceFigures)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: {},
      query: { ...queryOf(placeFiguresExample.valid()) },
      headers: {},
    };
    const result = figureCollectionExample.valid();
    service.listPlaceFigures.mockResolvedValue(result);

    const response = await send("GET", "/v1/statistics/figures", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.listPlaceFigures).toHaveBeenCalledTimes(1);
    expect(service.listPlaceFigures).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});
