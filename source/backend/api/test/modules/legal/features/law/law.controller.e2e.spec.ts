import "reflect-metadata";

import { Global, type INestApplication, Module } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { getDataSourceToken } from "@nestjs/typeorm";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { effectCollectionExample } from "@test/modules/legal/schema/dto/examples/effect-collection.dto.example.ts";
import { identityEffectsExample } from "@test/modules/legal/schema/dto/examples/identity-effects.dto.example.ts";
import { instrumentCollectionExample } from "@test/modules/legal/schema/dto/examples/instrument-collection.dto.example.ts";
import { instrumentDetailExample } from "@test/modules/legal/schema/dto/examples/instrument-detail.dto.example.ts";
import { instrumentKeyExample } from "@test/modules/legal/schema/dto/examples/instrument-key.dto.example.ts";
import { instrumentWindowExample } from "@test/modules/legal/schema/dto/examples/instrument-window.dto.example.ts";
import { provisionCollectionExample } from "@test/modules/legal/schema/dto/examples/provision-collection.dto.example.ts";
import { provisionScopeExample } from "@test/modules/legal/schema/dto/examples/provision-scope.dto.example.ts";

import { HttpValidationPipe, httpOptions } from "#/server/http.options.ts";
import { LegalLawModule } from "#/modules/legal/features/law/law.module.ts";
import { LegalLawService } from "#/modules/legal/features/law/law.service.ts";

/**
 * Managed by Dryv: the Law HTTP surface behaves as its contract says. The
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
  getInstrument: vi.fn(),
  listEffects: vi.fn(),
  listInstruments: vi.fn(),
  listProvisions: vi.fn(),
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
    imports: [InMemoryDataSourceModule, LegalLawModule],
  })
    .overrideProvider(LegalLawService)
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

describe("GET /v1/legal/instruments/{code} (getInstrument)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: { code: "value" },
      query: {},
      headers: {},
    };
    const result = instrumentDetailExample.valid();
    service.getInstrument.mockResolvedValue(result);

    const response = await send("GET", "/v1/legal/instruments/{code}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getInstrument).toHaveBeenCalledTimes(1);
    expect(service.getInstrument).toHaveBeenCalledWith(
      expect.objectContaining({ code: String("value") }),
    );
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/legal/effects (listEffects)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: {},
      query: { ...queryOf(identityEffectsExample.valid()) },
      headers: {},
    };
    const result = effectCollectionExample.valid();
    service.listEffects.mockResolvedValue(result);

    const response = await send("GET", "/v1/legal/effects", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.listEffects).toHaveBeenCalledTimes(1);
    expect(service.listEffects).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/legal/instruments (listInstruments)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: {},
      query: { ...queryOf(instrumentWindowExample.valid()) },
      headers: {},
    };
    const result = instrumentCollectionExample.valid();
    service.listInstruments.mockResolvedValue(result);

    const response = await send("GET", "/v1/legal/instruments", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.listInstruments).toHaveBeenCalledTimes(1);
    expect(service.listInstruments).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/legal/provisions (listProvisions)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: {},
      query: { ...queryOf(provisionScopeExample.valid()) },
      headers: {},
    };
    const result = provisionCollectionExample.valid();
    service.listProvisions.mockResolvedValue(result);

    const response = await send("GET", "/v1/legal/provisions", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.listProvisions).toHaveBeenCalledTimes(1);
    expect(service.listProvisions).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});
