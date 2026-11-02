import "reflect-metadata";

import { Global, type INestApplication, Module } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { getDataSourceToken } from "@nestjs/typeorm";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { eventLinkListQueryExample } from "#/modules/events/dto/event-link-list-query.dto.example.ts";
import { eventLinkResponseExample } from "#/modules/events/dto/event-link-response.dto.example.ts";
import { eventLinksListResponseExample } from "#/modules/events/dto/event-links-list-response.dto.example.ts";
import { eventListQueryExample } from "#/modules/events/dto/event-list-query.dto.example.ts";
import { eventResponseExample } from "#/modules/events/dto/event-response.dto.example.ts";
import { eventsListResponseExample } from "#/modules/events/dto/events-list-response.dto.example.ts";

import { HttpValidationPipe, httpOptions } from "#/server/http.options.ts";
import { EventsEventsReadModule } from "#/modules/events/events-read/events-read.module.ts";
import { EventsEventsReadService } from "#/modules/events/events-read/events-read.service.ts";

/**
 * Managed by Dryv: the Events Read HTTP surface behaves as its contract says. The
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
  findEventLinks: vi.fn(),
  findEvents: vi.fn(),
  getEventById: vi.fn(),
  getEventLinkById: vi.fn(),
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
    imports: [InMemoryDataSourceModule, EventsEventsReadModule],
  })
    .overrideProvider(EventsEventsReadService)
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

describe("GET /v1/events/links (findEventLinks)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(eventLinkListQueryExample.valid()), },
        headers: { },
      };
    const result = eventLinksListResponseExample.valid();
    service.findEventLinks.mockResolvedValue(result);

    const response = await send("GET", "/v1/events/links", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findEventLinks).toHaveBeenCalledTimes(1);
    expect(service.findEventLinks).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/events/events (findEvents)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(eventListQueryExample.valid()), },
        headers: { },
      };
    const result = eventsListResponseExample.valid();
    service.findEvents.mockResolvedValue(result);

    const response = await send("GET", "/v1/events/events", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findEvents).toHaveBeenCalledTimes(1);
    expect(service.findEvents).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/events/events/{eventId} (getEventById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "eventId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = eventResponseExample.valid();
    service.getEventById.mockResolvedValue(result);

    const response = await send("GET", "/v1/events/events/{eventId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getEventById).toHaveBeenCalledTimes(1);
    expect(service.getEventById).toHaveBeenCalledWith(expect.objectContaining({ eventId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/events/links/{linkId} (getEventLinkById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "linkId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = eventLinkResponseExample.valid();
    service.getEventLinkById.mockResolvedValue(result);

    const response = await send("GET", "/v1/events/links/{linkId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getEventLinkById).toHaveBeenCalledTimes(1);
    expect(service.getEventLinkById).toHaveBeenCalledWith(expect.objectContaining({ linkId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});