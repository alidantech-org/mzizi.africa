import "reflect-metadata";

import { Global, type INestApplication, Module } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { getDataSourceToken } from "@nestjs/typeorm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { AppModule } from "#/app.module.ts";
import { DatabaseModule } from "#/database/database.module.ts";

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
  ["GET", "/v1/account"],
  ["GET", "/v1/admin/accounts"],
  ["GET", "/v1/calendar"],
  ["GET", "/v1/context"],
  ["GET", "/v1/copy"],
  ["GET", "/v1/facilities/{code}".replace("{code}", encodeURIComponent(String("value")))],
  ["GET", "/v1/facilities"],
  ["GET", "/v1/facts"],
  ["GET", "/v1/explorer/copy"],
  ["GET", "/v1/explorer/boundaries"],
  ["GET", "/v1/explorer/context"],
  ["GET", "/v1/explorer/location"],
  ["GET", "/v1/explorer/navigation"],
  ["GET", "/v1/explorer/overview"],
  ["GET", "/v1/explorer/setup"],
  ["GET", "/v1/explorer/children"],
  ["POST", "/v1/explorer/addresses"],
  ["POST", "/v1/explorer/resolve"],
  ["GET", "/v1/explorer/search"],
  ["GET", "/v1/geography/feature-kinds"],
  ["GET", "/v1/geography/features"],
  ["GET", "/v1/geography/geometries"],
  [
    "GET",
    "/v1/geography/features/{featureId}".replace(
      "{featureId}",
      encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")),
    ),
  ],
  [
    "GET",
    "/v1/geography/features/{featureId}/geometries".replace(
      "{featureId}",
      encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")),
    ),
  ],
  ["GET", "/v1/governance/institutions"],
  [
    "GET",
    "/v1/governance/institutions/{institutionId}".replace(
      "{institutionId}",
      encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")),
    ),
  ],
  [
    "GET",
    "/v1/governance/offices/{officeId}".replace(
      "{officeId}",
      encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")),
    ),
  ],
  ["GET", "/v1/browse"],
  ["GET", "/v1/compare/options"],
  ["GET", "/v1/compare/options/at"],
  ["GET", "/v1/compare"],
  ["GET", "/v1/compare/at"],
  ["GET", "/v1/content"],
  [
    "GET",
    "/v1/elections/{electionId}".replace(
      "{electionId}",
      encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")),
    ),
  ],
  ["GET", "/v1/election-at"],
  ["GET", "/v1/governance/tabs"],
  ["GET", "/v1/governance/tree"],
  [
    "GET",
    "/v1/statistics/indicators/{indicatorCode}/map".replace(
      "{indicatorCode}",
      encodeURIComponent(String("value")),
    ),
  ],
  [
    "GET",
    "/v1/statistics/indicators/{indicatorCode}/series".replace(
      "{indicatorCode}",
      encodeURIComponent(String("value")),
    ),
  ],
  ["GET", "/v1/institutions/{code}".replace("{code}", encodeURIComponent(String("value")))],
  ["GET", "/v1/leaders/{code}".replace("{code}", encodeURIComponent(String("value")))],
  ["GET", "/v1/leaders/tree"],
  [
    "GET",
    "/v1/leaderboards/{metricCode}".replace("{metricCode}", encodeURIComponent(String("value"))),
  ],
  ["GET", "/v1/legal-basis"],
  ["GET", "/v1/motions/{code}".replace("{code}", encodeURIComponent(String("value")))],
  ["GET", "/v1/projects/near"],
  ["GET", "/v1/parties/{code}".replace("{code}", encodeURIComponent(String("value")))],
  [
    "GET",
    "/v1/civic/places/{featureId}".replace(
      "{featureId}",
      encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")),
    ),
  ],
  ["GET", "/v1/civic/place"],
  [
    "GET",
    "/v1/elections/places/{featureId}".replace(
      "{featureId}",
      encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")),
    ),
  ],
  [
    "GET",
    "/v1/statistics/places/{featureId}".replace(
      "{featureId}",
      encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")),
    ),
  ],
  ["GET", "/v1/statistics/place"],
  ["GET", "/v1/projects/{code}".replace("{code}", encodeURIComponent(String("value")))],
  ["GET", "/v1/tender/{code}".replace("{code}", encodeURIComponent(String("value")))],
  ["GET", "/v1/search"],
  ["GET", "/v1/content/list"],
  ["GET", "/v1/elections"],
  ["GET", "/v1/institutions"],
  ["GET", "/v1/law"],
  ["GET", "/v1/leaderboards"],
  ["GET", "/v1/motions"],
  ["GET", "/v1/parties"],
  ["GET", "/v1/tenders"],
  ["GET", "/v1/tenders/at"],
  ["GET", "/v1/engagement"],
  ["POST", "/v1/likes"],
  ["POST", "/v1/views"],
  ["POST", "/v1/likes/remove"],
  ["GET", "/v1/coverage"],
  ["GET", "/v1/budgets"],
  ["GET", "/v1/coalitions"],
  ["GET", "/v1/funds"],
  ["GET", "/v1/manifestos"],
  ["GET", "/v1/sources"],
  [
    "GET",
    "/v1/evidence/{citationId}".replace(
      "{citationId}",
      encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")),
    ),
  ],
  [
    "GET",
    "/v1/locality/{featureId}".replace(
      "{featureId}",
      encodeURIComponent(String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11")),
    ),
  ],
  ["GET", "/v1/languages"],
  ["GET", "/v1/locality/at"],
  ["GET", "/v1/locality/search"],
  ["GET", "/v1/reference/values"],
  ["GET", "/v1/reference/schemes"],
  ["GET", "/v1/reference/lookup"],
  ["GET", "/v1/structure/context"],
  ["GET", "/v1/structure"],
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
