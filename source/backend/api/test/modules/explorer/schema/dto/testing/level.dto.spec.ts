import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { LevelDto } from "#/modules/explorer/schema/dto/level.dto.ts";
import { levelExample } from "@test/modules/explorer/schema/dto/examples/level.dto.example.ts";

/** Managed by Dryv: LevelDto enforces exactly what the Level contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(LevelDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = levelExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("LevelDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(levelExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...levelExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
