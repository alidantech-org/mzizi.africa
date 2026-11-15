import "reflect-metadata";

import { Global, type INestApplication, Module } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { getDataSourceToken } from "@nestjs/typeorm";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { accountCollectionExample } from "#/modules/auth/dto/account-collection.dto.example.ts";
import { accountReadExample } from "#/modules/auth/dto/account-read.dto.example.ts";
import { accountWindowExample } from "#/modules/auth/dto/account-window.dto.example.ts";

import { HttpValidationPipe, httpOptions } from "#/server/http.options.ts";
import { AuthAccountsModule } from "#/modules/auth/accounts/accounts.module.ts";
import { AuthAccountsService } from "#/modules/auth/accounts/accounts.service.ts";

/**
 * Managed by Dryv: the Accounts HTTP surface behaves as its contract says. The
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
  getMyAccount: vi.fn(),
  listAccounts: vi.fn(),
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
    imports: [InMemoryDataSourceModule, AuthAccountsModule],
  })
    .overrideProvider(AuthAccountsService)
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

describe("GET /v1/account (getMyAccount)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { },
        headers: { },
      };
    const result = accountReadExample.valid();
    service.getMyAccount.mockResolvedValue(result);

    const response = await send("GET", "/v1/account", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getMyAccount).toHaveBeenCalledTimes(1);
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/admin/accounts (listAccounts)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(accountWindowExample.valid()), },
        headers: { },
      };
    const result = accountCollectionExample.valid();
    service.listAccounts.mockResolvedValue(result);

    const response = await send("GET", "/v1/admin/accounts", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.listAccounts).toHaveBeenCalledTimes(1);
    expect(service.listAccounts).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});