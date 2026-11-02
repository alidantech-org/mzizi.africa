import "reflect-metadata";

import { Global, type INestApplication, Module } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { getDataSourceToken } from "@nestjs/typeorm";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { indicatorCategoriesListResponseExample } from "#/modules/statistics/dto/indicator-categories-list-response.dto.example.ts";
import { indicatorCategoryListQueryExample } from "#/modules/statistics/dto/indicator-category-list-query.dto.example.ts";
import { indicatorCategoryResponseExample } from "#/modules/statistics/dto/indicator-category-response.dto.example.ts";
import { indicatorColumnListQueryExample } from "#/modules/statistics/dto/indicator-column-list-query.dto.example.ts";
import { indicatorColumnResponseExample } from "#/modules/statistics/dto/indicator-column-response.dto.example.ts";
import { indicatorColumnsListResponseExample } from "#/modules/statistics/dto/indicator-columns-list-response.dto.example.ts";
import { indicatorListQueryExample } from "#/modules/statistics/dto/indicator-list-query.dto.example.ts";
import { indicatorResponseExample } from "#/modules/statistics/dto/indicator-response.dto.example.ts";
import { indicatorsListResponseExample } from "#/modules/statistics/dto/indicators-list-response.dto.example.ts";
import { observationListQueryExample } from "#/modules/statistics/dto/observation-list-query.dto.example.ts";
import { observationResponseExample } from "#/modules/statistics/dto/observation-response.dto.example.ts";
import { observationsListResponseExample } from "#/modules/statistics/dto/observations-list-response.dto.example.ts";
import { periodListQueryExample } from "#/modules/statistics/dto/period-list-query.dto.example.ts";
import { periodResponseExample } from "#/modules/statistics/dto/period-response.dto.example.ts";
import { periodsListResponseExample } from "#/modules/statistics/dto/periods-list-response.dto.example.ts";
import { statisticsTableListQueryExample } from "#/modules/statistics/dto/statistics-table-list-query.dto.example.ts";
import { statisticsTableResponseExample } from "#/modules/statistics/dto/statistics-table-response.dto.example.ts";
import { statisticsTablesListResponseExample } from "#/modules/statistics/dto/statistics-tables-list-response.dto.example.ts";

import { HttpValidationPipe, httpOptions } from "#/server/http.options.ts";
import { StatisticsStatisticsReadModule } from "#/modules/statistics/statistics-read/statistics-read.module.ts";
import { StatisticsStatisticsReadService } from "#/modules/statistics/statistics-read/statistics-read.service.ts";

/**
 * Managed by Dryv: the Statistics Read HTTP surface behaves as its contract says. The
 * project implementation is replaced with mocks, so these specs check routing, input binding,
 * validation, status codes and response passthrough without business logic or a database.
 */

// Repositories resolve without a database; the mocked service never reaches them.
@Global()
@Module({
  providers: [
    {
      provide: getDataSourceToken(),
      useValue: { options: { type: "postgres" }, entityMetadatas: [], getRepository: () => ({}) },
    },
  ],
  exports: [getDataSourceToken()],
})
class InMemoryDataSourceModule {}

const service = {
  findIndicatorCategories: vi.fn(),
  findIndicatorColumns: vi.fn(),
  findIndicators: vi.fn(),
  findObservations: vi.fn(),
  findPeriods: vi.fn(),
  findStatisticsTables: vi.fn(),
  getIndicatorById: vi.fn(),
  getIndicatorCategoryById: vi.fn(),
  getIndicatorColumnById: vi.fn(),
  getObservationById: vi.fn(),
  getPeriodById: vi.fn(),
  getStatisticsTableById: vi.fn(),
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
    imports: [InMemoryDataSourceModule, StatisticsStatisticsReadModule],
  })
    .overrideProvider(StatisticsStatisticsReadService)
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
    Object.entries(value).filter(([, item]) => item === null || typeof item !== "object" || Array.isArray(item)),
  );
}

async function send(method: string, path: string, sent: Sent): Promise<Response> {
  const url = new URL(
    base + path.replace(/\{(\w+)\}/g, (_match, name: string) => encodeURIComponent(String(sent.params[name]))),
  );
  for (const [key, value] of Object.entries(sent.query)) {
    for (const item of Array.isArray(value) ? value : [value]) url.searchParams.append(key, String(item));
  }
  return fetch(url, {
    method,
    headers: { "content-type": "application/json", ...sent.headers },
    body: sent.body === undefined ? undefined : JSON.stringify(sent.body),
  });
}

describe("GET /v1/statistics/indicator-categories (findIndicatorCategories)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(indicatorCategoryListQueryExample.valid()), },
        headers: { },
      };
    const result = indicatorCategoriesListResponseExample.valid();
    service.findIndicatorCategories.mockResolvedValue(result);

    const response = await send("GET", "/v1/statistics/indicator-categories", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findIndicatorCategories).toHaveBeenCalledTimes(1);
    expect(service.findIndicatorCategories).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/statistics/indicator-columns (findIndicatorColumns)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(indicatorColumnListQueryExample.valid()), },
        headers: { },
      };
    const result = indicatorColumnsListResponseExample.valid();
    service.findIndicatorColumns.mockResolvedValue(result);

    const response = await send("GET", "/v1/statistics/indicator-columns", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findIndicatorColumns).toHaveBeenCalledTimes(1);
    expect(service.findIndicatorColumns).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/statistics/indicators (findIndicators)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(indicatorListQueryExample.valid()), },
        headers: { },
      };
    const result = indicatorsListResponseExample.valid();
    service.findIndicators.mockResolvedValue(result);

    const response = await send("GET", "/v1/statistics/indicators", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findIndicators).toHaveBeenCalledTimes(1);
    expect(service.findIndicators).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/statistics/observations (findObservations)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(observationListQueryExample.valid()), },
        headers: { },
      };
    const result = observationsListResponseExample.valid();
    service.findObservations.mockResolvedValue(result);

    const response = await send("GET", "/v1/statistics/observations", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findObservations).toHaveBeenCalledTimes(1);
    expect(service.findObservations).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/statistics/periods (findPeriods)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(periodListQueryExample.valid()), },
        headers: { },
      };
    const result = periodsListResponseExample.valid();
    service.findPeriods.mockResolvedValue(result);

    const response = await send("GET", "/v1/statistics/periods", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findPeriods).toHaveBeenCalledTimes(1);
    expect(service.findPeriods).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/statistics/tables (findStatisticsTables)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(statisticsTableListQueryExample.valid()), },
        headers: { },
      };
    const result = statisticsTablesListResponseExample.valid();
    service.findStatisticsTables.mockResolvedValue(result);

    const response = await send("GET", "/v1/statistics/tables", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findStatisticsTables).toHaveBeenCalledTimes(1);
    expect(service.findStatisticsTables).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/statistics/indicators/{indicatorId} (getIndicatorById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "indicatorId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = indicatorResponseExample.valid();
    service.getIndicatorById.mockResolvedValue(result);

    const response = await send("GET", "/v1/statistics/indicators/{indicatorId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getIndicatorById).toHaveBeenCalledTimes(1);
    expect(service.getIndicatorById).toHaveBeenCalledWith(expect.objectContaining({ indicatorId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/statistics/indicator-categories/{categoryId} (getIndicatorCategoryById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "categoryId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = indicatorCategoryResponseExample.valid();
    service.getIndicatorCategoryById.mockResolvedValue(result);

    const response = await send("GET", "/v1/statistics/indicator-categories/{categoryId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getIndicatorCategoryById).toHaveBeenCalledTimes(1);
    expect(service.getIndicatorCategoryById).toHaveBeenCalledWith(expect.objectContaining({ categoryId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/statistics/indicator-columns/{columnId} (getIndicatorColumnById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "columnId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = indicatorColumnResponseExample.valid();
    service.getIndicatorColumnById.mockResolvedValue(result);

    const response = await send("GET", "/v1/statistics/indicator-columns/{columnId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getIndicatorColumnById).toHaveBeenCalledTimes(1);
    expect(service.getIndicatorColumnById).toHaveBeenCalledWith(expect.objectContaining({ columnId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/statistics/observations/{observationId} (getObservationById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "observationId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = observationResponseExample.valid();
    service.getObservationById.mockResolvedValue(result);

    const response = await send("GET", "/v1/statistics/observations/{observationId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getObservationById).toHaveBeenCalledTimes(1);
    expect(service.getObservationById).toHaveBeenCalledWith(expect.objectContaining({ observationId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/statistics/periods/{periodId} (getPeriodById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "periodId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = periodResponseExample.valid();
    service.getPeriodById.mockResolvedValue(result);

    const response = await send("GET", "/v1/statistics/periods/{periodId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getPeriodById).toHaveBeenCalledTimes(1);
    expect(service.getPeriodById).toHaveBeenCalledWith(expect.objectContaining({ periodId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/statistics/tables/{tableId} (getStatisticsTableById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "tableId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = statisticsTableResponseExample.valid();
    service.getStatisticsTableById.mockResolvedValue(result);

    const response = await send("GET", "/v1/statistics/tables/{tableId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getStatisticsTableById).toHaveBeenCalledTimes(1);
    expect(service.getStatisticsTableById).toHaveBeenCalledWith(expect.objectContaining({ tableId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});