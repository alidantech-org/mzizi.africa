import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { RankingRequestDto } from "#/modules/frontend/schema/dto/ranking-request.dto.ts";
import { rankingRequestExample } from "@test/modules/frontend/schema/dto/examples/ranking-request.dto.example.ts";

/** Managed by Dryv: RankingRequestDto enforces exactly what the RankingRequest contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(RankingRequestDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = rankingRequestExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("RankingRequestDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(rankingRequestExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...rankingRequestExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
