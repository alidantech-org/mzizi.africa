import "reflect-metadata";

import { Global, type INestApplication, Module } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { getDataSourceToken } from "@nestjs/typeorm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { AppModule } from "#/app.module.ts";
import { DatabaseModule } from "./database/database.module.ts";

// Stands in for the project's DatabaseModule: repositories resolve without a database.
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
class InMemoryDatabaseModule {}

/**
 * Managed by Dryv: the assembled application (AppModule -> group modules -> feature modules ->
 * the project's implementations) boots and serves every route its contracts declare. A route
 * may answer 4xx/5xx while its use case is unimplemented, but it must never be missing (404).
 */
const routes: Array<[method: string, path: string]> = [
  [
    "GET",
    "/v1/geography/entities/{entityId}/children/boundaries".replace(
      "{entityId}",
      encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")),
    ),
  ],
  [
    "GET",
    "/v1/geography/units/{unitId}".replace(
      "{unitId}",
      encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")),
    ),
  ],
  [
    "GET",
    "/v1/geography/entities/{entityId}/boundary".replace(
      "{entityId}",
      encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")),
    ),
  ],
  [
    "GET",
    "/v1/geography/entities/{entityId}".replace(
      "{entityId}",
      encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")),
    ),
  ],
  ["GET", "/v1/geography/search"],
];

let app: INestApplication;
let base: string;

beforeAll(async () => {
  const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
    .overrideModule(DatabaseModule)
    .useModule(InMemoryDatabaseModule)
    .compile();
  app = moduleRef.createNestApplication();
  await app.listen(0);
  base = (await app.getUrl()).replace("[::1]", "localhost");
});

afterAll(async () => {
  await app?.close();
});

describe("application assembly", () => {
  it.each(routes)("serves %s %s", async (method, path) => {
    const response = await fetch(base + path, {
      method,
      headers: { "content-type": "application/json" },
      body: method === "GET" || method === "DELETE" ? undefined : "{}",
    });
    expect(response.status).not.toBe(404);
  });
});
