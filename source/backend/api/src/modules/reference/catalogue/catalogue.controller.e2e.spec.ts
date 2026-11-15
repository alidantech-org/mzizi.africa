import "reflect-metadata";

import { Global, type INestApplication, Module } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { getDataSourceToken } from "@nestjs/typeorm";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { foundMemberExample } from "#/modules/reference/dto/found-member.dto.example.ts";
import { memberCollectionExample } from "#/modules/reference/dto/member-collection.dto.example.ts";
import { memberKeyExample } from "#/modules/reference/dto/member-key.dto.example.ts";
import { memberWindowExample } from "#/modules/reference/dto/member-window.dto.example.ts";
import { schemeCollectionExample } from "#/modules/reference/dto/scheme-collection.dto.example.ts";
import { schemeWindowExample } from "#/modules/reference/dto/scheme-window.dto.example.ts";

import { HttpValidationPipe, httpOptions } from "#/server/http.options.ts";
import { ReferenceCatalogueModule } from "#/modules/reference/catalogue/catalogue.module.ts";
import { ReferenceCatalogueService } from "#/modules/reference/catalogue/catalogue.service.ts";

/**
 * Managed by Dryv: the Catalogue HTTP surface behaves as its contract says. The
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
  browseSchemeMembers: vi.fn(),
  browseSchemes: vi.fn(),
  lookupMember: vi.fn(),
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
    imports: [InMemoryDataSourceModule, ReferenceCatalogueModule],
  })
    .overrideProvider(ReferenceCatalogueService)
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

describe("GET /v1/reference/values (browseSchemeMembers)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(memberWindowExample.valid()), },
        headers: { },
      };
    const result = memberCollectionExample.valid();
    service.browseSchemeMembers.mockResolvedValue(result);

    const response = await send("GET", "/v1/reference/values", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.browseSchemeMembers).toHaveBeenCalledTimes(1);
    expect(service.browseSchemeMembers).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/reference/schemes (browseSchemes)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(schemeWindowExample.valid()), },
        headers: { },
      };
    const result = schemeCollectionExample.valid();
    service.browseSchemes.mockResolvedValue(result);

    const response = await send("GET", "/v1/reference/schemes", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.browseSchemes).toHaveBeenCalledTimes(1);
    expect(service.browseSchemes).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/reference/lookup (lookupMember)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(memberKeyExample.valid()), },
        headers: { },
      };
    const result = foundMemberExample.valid();
    service.lookupMember.mockResolvedValue(result);

    const response = await send("GET", "/v1/reference/lookup", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.lookupMember).toHaveBeenCalledTimes(1);
    expect(service.lookupMember).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});