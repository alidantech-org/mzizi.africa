import "reflect-metadata";

import { Global, type INestApplication, Module } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { getDataSourceToken } from "@nestjs/typeorm";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { amenitiesListResponseExample } from "#/modules/services/dto/amenities-list-response.dto.example.ts";
import { amenityListQueryExample } from "#/modules/services/dto/amenity-list-query.dto.example.ts";
import { amenityOfficeListQueryExample } from "#/modules/services/dto/amenity-office-list-query.dto.example.ts";
import { amenityOfficeResponseExample } from "#/modules/services/dto/amenity-office-response.dto.example.ts";
import { amenityOfficesListResponseExample } from "#/modules/services/dto/amenity-offices-list-response.dto.example.ts";
import { amenityResponseExample } from "#/modules/services/dto/amenity-response.dto.example.ts";
import { publicServiceListQueryExample } from "#/modules/services/dto/public-service-list-query.dto.example.ts";
import { publicServiceResponseExample } from "#/modules/services/dto/public-service-response.dto.example.ts";
import { publicServicesListResponseExample } from "#/modules/services/dto/public-services-list-response.dto.example.ts";
import { serviceDeliveriesListResponseExample } from "#/modules/services/dto/service-deliveries-list-response.dto.example.ts";
import { serviceDeliveryListQueryExample } from "#/modules/services/dto/service-delivery-list-query.dto.example.ts";
import { serviceDeliveryResponseExample } from "#/modules/services/dto/service-delivery-response.dto.example.ts";

import { HttpValidationPipe, httpOptions } from "#/server/http.options.ts";
import { ServicesServicesReadModule } from "#/modules/services/services-read/services-read.module.ts";
import { ServicesServicesReadService } from "#/modules/services/services-read/services-read.service.ts";

/**
 * Managed by Dryv: the Services Read HTTP surface behaves as its contract says. The
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
  findAmenities: vi.fn(),
  findAmenityOffices: vi.fn(),
  findPublicServices: vi.fn(),
  findServiceDeliveries: vi.fn(),
  getAmenityById: vi.fn(),
  getAmenityOfficeById: vi.fn(),
  getPublicServiceById: vi.fn(),
  getServiceDeliveryById: vi.fn(),
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
    imports: [InMemoryDataSourceModule, ServicesServicesReadModule],
  })
    .overrideProvider(ServicesServicesReadService)
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

describe("GET /v1/services/amenities (findAmenities)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(amenityListQueryExample.valid()), },
        headers: { },
      };
    const result = amenitiesListResponseExample.valid();
    service.findAmenities.mockResolvedValue(result);

    const response = await send("GET", "/v1/services/amenities", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findAmenities).toHaveBeenCalledTimes(1);
    expect(service.findAmenities).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/services/amenity-offices (findAmenityOffices)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(amenityOfficeListQueryExample.valid()), },
        headers: { },
      };
    const result = amenityOfficesListResponseExample.valid();
    service.findAmenityOffices.mockResolvedValue(result);

    const response = await send("GET", "/v1/services/amenity-offices", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findAmenityOffices).toHaveBeenCalledTimes(1);
    expect(service.findAmenityOffices).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/services/services (findPublicServices)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(publicServiceListQueryExample.valid()), },
        headers: { },
      };
    const result = publicServicesListResponseExample.valid();
    service.findPublicServices.mockResolvedValue(result);

    const response = await send("GET", "/v1/services/services", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findPublicServices).toHaveBeenCalledTimes(1);
    expect(service.findPublicServices).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/services/deliveries (findServiceDeliveries)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(serviceDeliveryListQueryExample.valid()), },
        headers: { },
      };
    const result = serviceDeliveriesListResponseExample.valid();
    service.findServiceDeliveries.mockResolvedValue(result);

    const response = await send("GET", "/v1/services/deliveries", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findServiceDeliveries).toHaveBeenCalledTimes(1);
    expect(service.findServiceDeliveries).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/services/amenities/{amenityId} (getAmenityById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "amenityId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = amenityResponseExample.valid();
    service.getAmenityById.mockResolvedValue(result);

    const response = await send("GET", "/v1/services/amenities/{amenityId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getAmenityById).toHaveBeenCalledTimes(1);
    expect(service.getAmenityById).toHaveBeenCalledWith(expect.objectContaining({ amenityId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/services/amenity-offices/{amenityOfficeId} (getAmenityOfficeById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "amenityOfficeId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = amenityOfficeResponseExample.valid();
    service.getAmenityOfficeById.mockResolvedValue(result);

    const response = await send("GET", "/v1/services/amenity-offices/{amenityOfficeId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getAmenityOfficeById).toHaveBeenCalledTimes(1);
    expect(service.getAmenityOfficeById).toHaveBeenCalledWith(expect.objectContaining({ amenityOfficeId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/services/services/{serviceId} (getPublicServiceById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "serviceId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = publicServiceResponseExample.valid();
    service.getPublicServiceById.mockResolvedValue(result);

    const response = await send("GET", "/v1/services/services/{serviceId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getPublicServiceById).toHaveBeenCalledTimes(1);
    expect(service.getPublicServiceById).toHaveBeenCalledWith(expect.objectContaining({ serviceId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/services/deliveries/{deliveryId} (getServiceDeliveryById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "deliveryId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = serviceDeliveryResponseExample.valid();
    service.getServiceDeliveryById.mockResolvedValue(result);

    const response = await send("GET", "/v1/services/deliveries/{deliveryId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getServiceDeliveryById).toHaveBeenCalledTimes(1);
    expect(service.getServiceDeliveryById).toHaveBeenCalledWith(expect.objectContaining({ deliveryId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});