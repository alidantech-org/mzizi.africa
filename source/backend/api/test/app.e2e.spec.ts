import "reflect-metadata";

import { Global, type INestApplication, Module } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { AppModule } from "#/app.module.ts";

/**
 * Managed by Dryv: the assembled application (AppModule -> group modules -> feature modules ->
 * the project's implementations) boots and serves every route its contracts declare. A route
 * may answer 4xx/5xx while its use case is unimplemented, but it must never be missing (404).
 */
const routes: Array<[method: string, path: string]> = [
  ["GET", "/v1/account"],
  ["GET", "/v1/admin/accounts"],
  ["GET", "/v1/civic/projects/{code}".replace("{code}", encodeURIComponent(String("value")))],
  ["GET", "/v1/civic/tenders/{code}".replace("{code}", encodeURIComponent(String("value")))],
  ["GET", "/v1/civic/facilities"],
  ["GET", "/v1/civic/projects"],
  ["GET", "/v1/civic/tenders"],
  ["GET", "/v1/community/posts"],
  ["POST", "/v1/community/views"],
  ["GET", "/v1/election/elections/{code}".replace("{code}", encodeURIComponent(String("value")))],
  ["GET", "/v1/election/elections"],
  ["GET", "/v1/election/tallies"],
  ["GET", "/v1/event/occurrences"],
  ["GET", "/v1/finance/appropriations"],
  ["GET", "/v1/finance/budgets"],
  ["GET", "/v1/finance/findings"],
  ["GET", "/v1/frontend/copy"],
  ["GET", "/v1/frontend/home"],
  ["GET", "/v1/frontend/institution"],
  ["GET", "/v1/frontend/place"],
  ["GET", "/v1/frontend/ranking"],
  ["GET", "/v1/frontend/search"],
  ["GET", "/v1/geography/at"],
  ["GET", "/v1/geography/outlines"],
  ["GET", "/v1/geography/places/{code}".replace("{code}", encodeURIComponent(String("value")))],
  ["GET", "/v1/geography/child-outlines"],
  ["GET", "/v1/geography/children"],
  ["GET", "/v1/geography/places"],
  [
    "GET",
    "/v1/governance/institutions/{code}".replace("{code}", encodeURIComponent(String("value"))),
  ],
  ["GET", "/v1/governance/offices/{code}".replace("{code}", encodeURIComponent(String("value")))],
  ["GET", "/v1/governance/institutions"],
  ["GET", "/v1/governance/members"],
  ["GET", "/v1/governance/offices"],
  ["GET", "/v1/governance/powers"],
  ["GET", "/v1/history/eras"],
  ["GET", "/v1/history/occurrences"],
  ["GET", "/v1/identity/things/{code}".replace("{code}", encodeURIComponent(String("value")))],
  ["GET", "/v1/identity/addresses"],
  ["GET", "/v1/identity/search"],
  ["GET", "/v1/legal/instruments/{code}".replace("{code}", encodeURIComponent(String("value")))],
  ["GET", "/v1/legal/effects"],
  ["GET", "/v1/legal/instruments"],
  ["GET", "/v1/legal/provisions"],
  ["GET", "/v1/legislature/bills/{code}".replace("{code}", encodeURIComponent(String("value")))],
  ["GET", "/v1/legislature/bills"],
  ["GET", "/v1/legislature/votes"],
  ["GET", "/v1/media/articles/{code}".replace("{code}", encodeURIComponent(String("value")))],
  ["GET", "/v1/media/articles"],
  ["GET", "/v1/media/assets"],
  ["GET", "/v1/politics/parties/{code}".replace("{code}", encodeURIComponent(String("value")))],
  ["GET", "/v1/politics/commitments"],
  ["GET", "/v1/politics/parties"],
  ["GET", "/v1/product/site"],
  ["GET", "/v1/product/messages"],
  ["GET", "/v1/product/releases"],
  ["GET", "/v1/reference/countries/{code}".replace("{code}", encodeURIComponent(String("value")))],
  ["GET", "/v1/reference/countries"],
  ["GET", "/v1/reference/currencies"],
  ["GET", "/v1/reference/hierarchies"],
  ["GET", "/v1/reference/languages"],
  ["GET", "/v1/reference/units"],
  ["GET", "/v1/source/evidence"],
  ["GET", "/v1/source/sources"],
  [
    "GET",
    "/v1/statistics/indicators/{code}".replace("{code}", encodeURIComponent(String("value"))),
  ],
  ["GET", "/v1/statistics/indicator-figures"],
  ["GET", "/v1/statistics/indicators"],
  ["GET", "/v1/statistics/observations"],
  ["GET", "/v1/statistics/figures"],
  ["GET", "/v1/vocabulary/schemes/{code}".replace("{code}", encodeURIComponent(String("value")))],
  ["GET", "/v1/vocabulary/terms"],
];

let app: INestApplication;
let base: string;

beforeAll(async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();
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
