import "reflect-metadata";

import { Global, type INestApplication, Module } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { getDataSourceToken } from "@nestjs/typeorm";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { evidenceCollectionExample } from "@test/modules/source/schema/dto/examples/evidence-collection.dto.example.ts";
import { rowEvidenceExample } from "@test/modules/source/schema/dto/examples/row-evidence.dto.example.ts";
import { sourceCollectionExample } from "@test/modules/source/schema/dto/examples/source-collection.dto.example.ts";
import { sourceWindowExample } from "@test/modules/source/schema/dto/examples/source-window.dto.example.ts";

import { HttpValidationPipe, httpOptions } from "#/server/http.options.ts";
import { SourceProvenanceModule } from "#/modules/source/features/provenance/provenance.module.ts";
import { SourceProvenanceService } from "#/modules/source/features/provenance/provenance.service.ts";

/**
 * Managed by Dryv: the Provenance HTTP surface behaves as its contract says. The
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
  listEvidence: vi.fn(),
  listSources: vi.fn(),
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
    imports: [InMemoryDataSourceModule, SourceProvenanceModule],
  })
    .overrideProvider(SourceProvenanceService)
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

describe("GET /v1/source/evidence (listEvidence)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: {},
      query: { ...queryOf(rowEvidenceExample.valid()) },
      headers: {},
    };
    const result = evidenceCollectionExample.valid();
    service.listEvidence.mockResolvedValue(result);

    const response = await send("GET", "/v1/source/evidence", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.listEvidence).toHaveBeenCalledTimes(1);
    expect(service.listEvidence).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/source/sources (listSources)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: {},
      query: { ...queryOf(sourceWindowExample.valid()) },
      headers: {},
    };
    const result = sourceCollectionExample.valid();
    service.listSources.mockResolvedValue(result);

    const response = await send("GET", "/v1/source/sources", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.listSources).toHaveBeenCalledTimes(1);
    expect(service.listSources).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});
