import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { RankingScreenDto } from "#/modules/frontend/schema/dto/ranking-screen.dto.ts";
import { rankingScreenExample } from "@test/modules/frontend/schema/dto/examples/ranking-screen.dto.example.ts";

/** Managed by Dryv: RankingScreenDto enforces exactly what the RankingScreen contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(RankingScreenDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = rankingScreenExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("RankingScreenDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(rankingScreenExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...rankingScreenExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
