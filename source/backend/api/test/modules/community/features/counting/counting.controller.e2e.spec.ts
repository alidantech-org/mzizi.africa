import "reflect-metadata";

import { Global, type INestApplication, Module } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { getDataSourceToken } from "@nestjs/typeorm";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { recordedExample } from "@test/modules/community/schema/dto/examples/recorded.dto.example.ts";
import { viewInputExample } from "@test/modules/community/schema/dto/examples/view-input.dto.example.ts";

import { HttpValidationPipe, httpOptions } from "#/server/http.options.ts";
import { CommunityCountingModule } from "#/modules/community/features/counting/counting.module.ts";
import { CommunityCountingService } from "#/modules/community/features/counting/counting.service.ts";

/**
 * Managed by Dryv: the Counting HTTP surface behaves as its contract says. The
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
  recordView: vi.fn(),
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
    imports: [InMemoryDataSourceModule, CommunityCountingModule],
  })
    .overrideProvider(CommunityCountingService)
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

describe("POST /v1/community/views (recordView)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: {},
      query: {},
      headers: {},
      body: viewInputExample.valid(),
    };
    const result = recordedExample.valid();
    service.recordView.mockResolvedValue(result);

    const response = await send("POST", "/v1/community/views", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.recordView).toHaveBeenCalledTimes(1);
    expect(service.recordView).toHaveBeenCalledWith(
      expect.objectContaining({ body: expect.objectContaining(sent.body) }),
    );
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });

  it("rejects an invalid body without calling the service", async () => {
    const [violation] = viewInputExample.violations();
    if (violation === undefined) return;
    const sent: Sent = {
      ...{
        params: {},
        query: {},
        headers: {},
        body: viewInputExample.valid(),
      },
      body: violation.value,
    };

    const response = await send("POST", "/v1/community/views", sent);

    expect(response.status).toBe(400);
    expect(service.recordView).not.toHaveBeenCalled();
  });
});
