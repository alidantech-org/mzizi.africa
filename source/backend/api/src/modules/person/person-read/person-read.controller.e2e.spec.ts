import "reflect-metadata";

import { Global, type INestApplication, Module } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { getDataSourceToken } from "@nestjs/typeorm";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { peopleListResponseExample } from "#/modules/person/dto/people-list-response.dto.example.ts";
import { personContactListQueryExample } from "#/modules/person/dto/person-contact-list-query.dto.example.ts";
import { personContactResponseExample } from "#/modules/person/dto/person-contact-response.dto.example.ts";
import { personContactsListResponseExample } from "#/modules/person/dto/person-contacts-list-response.dto.example.ts";
import { personHandleListQueryExample } from "#/modules/person/dto/person-handle-list-query.dto.example.ts";
import { personHandleResponseExample } from "#/modules/person/dto/person-handle-response.dto.example.ts";
import { personHandlesListResponseExample } from "#/modules/person/dto/person-handles-list-response.dto.example.ts";
import { personListQueryExample } from "#/modules/person/dto/person-list-query.dto.example.ts";
import { personNameListQueryExample } from "#/modules/person/dto/person-name-list-query.dto.example.ts";
import { personNameResponseExample } from "#/modules/person/dto/person-name-response.dto.example.ts";
import { personNamesListResponseExample } from "#/modules/person/dto/person-names-list-response.dto.example.ts";
import { personProfileListQueryExample } from "#/modules/person/dto/person-profile-list-query.dto.example.ts";
import { personProfileResponseExample } from "#/modules/person/dto/person-profile-response.dto.example.ts";
import { personProfilesListResponseExample } from "#/modules/person/dto/person-profiles-list-response.dto.example.ts";
import { personResponseExample } from "#/modules/person/dto/person-response.dto.example.ts";

import { HttpValidationPipe, httpOptions } from "#/server/http.options.ts";
import { PersonPersonReadModule } from "#/modules/person/person-read/person-read.module.ts";
import { PersonPersonReadService } from "#/modules/person/person-read/person-read.service.ts";

/**
 * Managed by Dryv: the Person Read HTTP surface behaves as its contract says. The
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
  findPeople: vi.fn(),
  findPersonContacts: vi.fn(),
  findPersonHandles: vi.fn(),
  findPersonNames: vi.fn(),
  findPersonProfiles: vi.fn(),
  getPersonById: vi.fn(),
  getPersonContactById: vi.fn(),
  getPersonHandleById: vi.fn(),
  getPersonNameById: vi.fn(),
  getPersonProfileById: vi.fn(),
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
    imports: [InMemoryDataSourceModule, PersonPersonReadModule],
  })
    .overrideProvider(PersonPersonReadService)
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

describe("GET /v1/people/individuals (findPeople)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(personListQueryExample.valid()), },
        headers: { },
      };
    const result = peopleListResponseExample.valid();
    service.findPeople.mockResolvedValue(result);

    const response = await send("GET", "/v1/people/individuals", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findPeople).toHaveBeenCalledTimes(1);
    expect(service.findPeople).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/people/contacts (findPersonContacts)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(personContactListQueryExample.valid()), },
        headers: { },
      };
    const result = personContactsListResponseExample.valid();
    service.findPersonContacts.mockResolvedValue(result);

    const response = await send("GET", "/v1/people/contacts", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findPersonContacts).toHaveBeenCalledTimes(1);
    expect(service.findPersonContacts).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/people/handles (findPersonHandles)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(personHandleListQueryExample.valid()), },
        headers: { },
      };
    const result = personHandlesListResponseExample.valid();
    service.findPersonHandles.mockResolvedValue(result);

    const response = await send("GET", "/v1/people/handles", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findPersonHandles).toHaveBeenCalledTimes(1);
    expect(service.findPersonHandles).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/people/names (findPersonNames)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(personNameListQueryExample.valid()), },
        headers: { },
      };
    const result = personNamesListResponseExample.valid();
    service.findPersonNames.mockResolvedValue(result);

    const response = await send("GET", "/v1/people/names", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findPersonNames).toHaveBeenCalledTimes(1);
    expect(service.findPersonNames).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/people/profiles (findPersonProfiles)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(personProfileListQueryExample.valid()), },
        headers: { },
      };
    const result = personProfilesListResponseExample.valid();
    service.findPersonProfiles.mockResolvedValue(result);

    const response = await send("GET", "/v1/people/profiles", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findPersonProfiles).toHaveBeenCalledTimes(1);
    expect(service.findPersonProfiles).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/people/individuals/{personId} (getPersonById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "personId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = personResponseExample.valid();
    service.getPersonById.mockResolvedValue(result);

    const response = await send("GET", "/v1/people/individuals/{personId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getPersonById).toHaveBeenCalledTimes(1);
    expect(service.getPersonById).toHaveBeenCalledWith(expect.objectContaining({ personId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/people/contacts/{contactId} (getPersonContactById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "contactId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = personContactResponseExample.valid();
    service.getPersonContactById.mockResolvedValue(result);

    const response = await send("GET", "/v1/people/contacts/{contactId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getPersonContactById).toHaveBeenCalledTimes(1);
    expect(service.getPersonContactById).toHaveBeenCalledWith(expect.objectContaining({ contactId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/people/handles/{handleId} (getPersonHandleById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "handleId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = personHandleResponseExample.valid();
    service.getPersonHandleById.mockResolvedValue(result);

    const response = await send("GET", "/v1/people/handles/{handleId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getPersonHandleById).toHaveBeenCalledTimes(1);
    expect(service.getPersonHandleById).toHaveBeenCalledWith(expect.objectContaining({ handleId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/people/names/{personNameId} (getPersonNameById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "personNameId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = personNameResponseExample.valid();
    service.getPersonNameById.mockResolvedValue(result);

    const response = await send("GET", "/v1/people/names/{personNameId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getPersonNameById).toHaveBeenCalledTimes(1);
    expect(service.getPersonNameById).toHaveBeenCalledWith(expect.objectContaining({ personNameId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/people/profiles/{profileId} (getPersonProfileById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "profileId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = personProfileResponseExample.valid();
    service.getPersonProfileById.mockResolvedValue(result);

    const response = await send("GET", "/v1/people/profiles/{profileId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getPersonProfileById).toHaveBeenCalledTimes(1);
    expect(service.getPersonProfileById).toHaveBeenCalledWith(expect.objectContaining({ profileId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});