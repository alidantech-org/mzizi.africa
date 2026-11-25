import "reflect-metadata";

import { Global, type INestApplication, Module } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { getDataSourceToken } from "@nestjs/typeorm";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { countryFacilitiesExample } from "@test/modules/civic/schema/dto/examples/country-facilities.dto.example.ts";
import { facilityCollectionExample } from "@test/modules/civic/schema/dto/examples/facility-collection.dto.example.ts";
import { placeProjectsExample } from "@test/modules/civic/schema/dto/examples/place-projects.dto.example.ts";
import { projectCollectionExample } from "@test/modules/civic/schema/dto/examples/project-collection.dto.example.ts";
import { projectDetailExample } from "@test/modules/civic/schema/dto/examples/project-detail.dto.example.ts";
import { projectKeyExample } from "@test/modules/civic/schema/dto/examples/project-key.dto.example.ts";

import { HttpValidationPipe, httpOptions } from "#/server/http.options.ts";
import { CivicDeliveryModule } from "#/modules/civic/features/delivery/delivery.module.ts";
import { CivicDeliveryService } from "#/modules/civic/features/delivery/delivery.service.ts";

/**
 * Managed by Dryv: the Delivery HTTP surface behaves as its contract says. The
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
  getProject: vi.fn(),
  listFacilities: vi.fn(),
  listPlaceProjects: vi.fn(),
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
    imports: [InMemoryDataSourceModule, CivicDeliveryModule],
  })
    .overrideProvider(CivicDeliveryService)
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

describe("GET /v1/civic/projects/{code} (getProject)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: { code: "value" },
      query: {},
      headers: {},
    };
    const result = projectDetailExample.valid();
    service.getProject.mockResolvedValue(result);

    const response = await send("GET", "/v1/civic/projects/{code}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getProject).toHaveBeenCalledTimes(1);
    expect(service.getProject).toHaveBeenCalledWith(
      expect.objectContaining({ code: String("value") }),
    );
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/civic/facilities (listFacilities)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: {},
      query: { ...queryOf(countryFacilitiesExample.valid()) },
      headers: {},
    };
    const result = facilityCollectionExample.valid();
    service.listFacilities.mockResolvedValue(result);

    const response = await send("GET", "/v1/civic/facilities", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.listFacilities).toHaveBeenCalledTimes(1);
    expect(service.listFacilities).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/civic/projects (listPlaceProjects)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: {},
      query: { ...queryOf(placeProjectsExample.valid()) },
      headers: {},
    };
    const result = projectCollectionExample.valid();
    service.listPlaceProjects.mockResolvedValue(result);

    const response = await send("GET", "/v1/civic/projects", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.listPlaceProjects).toHaveBeenCalledTimes(1);
    expect(service.listPlaceProjects).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});
