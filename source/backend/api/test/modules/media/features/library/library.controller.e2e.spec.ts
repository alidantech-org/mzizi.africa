import "reflect-metadata";

import { Global, type INestApplication, Module } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { getDataSourceToken } from "@nestjs/typeorm";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { articleCollectionExample } from "@test/modules/media/schema/dto/examples/article-collection.dto.example.ts";
import { articleDetailExample } from "@test/modules/media/schema/dto/examples/article-detail.dto.example.ts";
import { articleKeyExample } from "@test/modules/media/schema/dto/examples/article-key.dto.example.ts";
import { identityMediaExample } from "@test/modules/media/schema/dto/examples/identity-media.dto.example.ts";
import { useCollectionExample } from "@test/modules/media/schema/dto/examples/use-collection.dto.example.ts";

import { HttpValidationPipe, httpOptions } from "#/server/http.options.ts";
import { MediaLibraryModule } from "#/modules/media/features/library/library.module.ts";
import { MediaLibraryService } from "#/modules/media/features/library/library.service.ts";

/**
 * Managed by Dryv: the Library HTTP surface behaves as its contract says. The
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
  getArticle: vi.fn(),
  listArticles: vi.fn(),
  listAssets: vi.fn(),
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
    imports: [InMemoryDataSourceModule, MediaLibraryModule],
  })
    .overrideProvider(MediaLibraryService)
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

describe("GET /v1/media/articles/{code} (getArticle)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: { code: "value" },
      query: {},
      headers: {},
    };
    const result = articleDetailExample.valid();
    service.getArticle.mockResolvedValue(result);

    const response = await send("GET", "/v1/media/articles/{code}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getArticle).toHaveBeenCalledTimes(1);
    expect(service.getArticle).toHaveBeenCalledWith(
      expect.objectContaining({ code: String("value") }),
    );
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/media/articles (listArticles)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: {},
      query: { ...queryOf(identityMediaExample.valid()) },
      headers: {},
    };
    const result = articleCollectionExample.valid();
    service.listArticles.mockResolvedValue(result);

    const response = await send("GET", "/v1/media/articles", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.listArticles).toHaveBeenCalledTimes(1);
    expect(service.listArticles).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/media/assets (listAssets)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: {},
      query: { ...queryOf(identityMediaExample.valid()) },
      headers: {},
    };
    const result = useCollectionExample.valid();
    service.listAssets.mockResolvedValue(result);

    const response = await send("GET", "/v1/media/assets", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.listAssets).toHaveBeenCalledTimes(1);
    expect(service.listAssets).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});
