import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { RankRowDto } from "#/modules/frontend/schema/dto/rank-row.dto.ts";
import { rankRowExample } from "@test/modules/frontend/schema/dto/examples/rank-row.dto.example.ts";

/** Managed by Dryv: RankRowDto enforces exactly what the RankRow contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(RankRowDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = rankRowExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("RankRowDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(rankRowExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...rankRowExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
