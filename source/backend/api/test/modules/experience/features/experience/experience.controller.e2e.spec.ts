import "reflect-metadata";

import { Global, type INestApplication, Module } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { getDataSourceToken } from "@nestjs/typeorm";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { calendarInputExample } from "@test/modules/experience/schema/dto/examples/calendar-input.dto.example.ts";
import { calendarExample } from "@test/modules/experience/schema/dto/examples/calendar.dto.example.ts";
import { contextInputExample } from "@test/modules/experience/schema/dto/examples/context-input.dto.example.ts";
import { contextExample } from "@test/modules/experience/schema/dto/examples/context.dto.example.ts";
import { copyCatalogExample } from "@test/modules/experience/schema/dto/examples/copy-catalog.dto.example.ts";
import { copyInputExample } from "@test/modules/experience/schema/dto/examples/copy-input.dto.example.ts";
import { facilitiesInputExample } from "@test/modules/experience/schema/dto/examples/facilities-input.dto.example.ts";
import { facilityDetailExample } from "@test/modules/experience/schema/dto/examples/facility-detail.dto.example.ts";
import { facilityKeyExample } from "@test/modules/experience/schema/dto/examples/facility-key.dto.example.ts";
import { facilityListExample } from "@test/modules/experience/schema/dto/examples/facility-list.dto.example.ts";
import { factListExample } from "@test/modules/experience/schema/dto/examples/fact-list.dto.example.ts";
import { factsInputExample } from "@test/modules/experience/schema/dto/examples/facts-input.dto.example.ts";

import { HttpValidationPipe, httpOptions } from "#/server/http.options.ts";
import { ExperienceExperienceModule } from "#/modules/experience/features/experience/experience.module.ts";
import { ExperienceExperienceService } from "#/modules/experience/features/experience/experience.service.ts";

/**
 * Managed by Dryv: the Experience HTTP surface behaves as its contract says. The
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
  getCalendar: vi.fn(),
  getContext: vi.fn(),
  getCopy: vi.fn(),
  getFacility: vi.fn(),
  listFacilities: vi.fn(),
  listFacts: vi.fn(),
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
    imports: [InMemoryDataSourceModule, ExperienceExperienceModule],
  })
    .overrideProvider(ExperienceExperienceService)
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

describe("GET /v1/calendar (getCalendar)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: {},
      query: { ...queryOf(calendarInputExample.valid()) },
      headers: {},
    };
    const result = calendarExample.valid();
    service.getCalendar.mockResolvedValue(result);

    const response = await send("GET", "/v1/calendar", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getCalendar).toHaveBeenCalledTimes(1);
    expect(service.getCalendar).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/context (getContext)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: {},
      query: {
        countryCode: "value",
        languageCode: "value",
        path: "value",
        featureId: "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11",
      },
      headers: { "cf-ipcountry": String("value") },
    };
    const result = contextExample.valid();
    service.getContext.mockResolvedValue(result);

    const response = await send("GET", "/v1/context", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getContext).toHaveBeenCalledTimes(1);
    expect(service.getContext).toHaveBeenCalledWith(
      expect.objectContaining({
        countryCode: String("value"),
        languageCode: String("value"),
        path: String("value"),
        featureId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"),
        edgeCountry: String("value"),
      }),
    );
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/copy (getCopy)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: {},
      query: { ...queryOf(copyInputExample.valid()) },
      headers: {},
    };
    const result = copyCatalogExample.valid();
    service.getCopy.mockResolvedValue(result);

    const response = await send("GET", "/v1/copy", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getCopy).toHaveBeenCalledTimes(1);
    expect(service.getCopy).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/facilities/{code} (getFacility)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: { code: "value" },
      query: { languageCode: "value" },
      headers: {},
    };
    const result = facilityDetailExample.valid();
    service.getFacility.mockResolvedValue(result);

    const response = await send("GET", "/v1/facilities/{code}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getFacility).toHaveBeenCalledTimes(1);
    expect(service.getFacility).toHaveBeenCalledWith(
      expect.objectContaining({
        code: String("value"),
        languageCode: String("value"),
      }),
    );
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/facilities (listFacilities)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: {},
      query: { ...queryOf(facilitiesInputExample.valid()) },
      headers: {},
    };
    const result = facilityListExample.valid();
    service.listFacilities.mockResolvedValue(result);

    const response = await send("GET", "/v1/facilities", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.listFacilities).toHaveBeenCalledTimes(1);
    expect(service.listFacilities).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/facts (listFacts)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: {},
      query: { ...queryOf(factsInputExample.valid()) },
      headers: {},
    };
    const result = factListExample.valid();
    service.listFacts.mockResolvedValue(result);

    const response = await send("GET", "/v1/facts", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.listFacts).toHaveBeenCalledTimes(1);
    expect(service.listFacts).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});
