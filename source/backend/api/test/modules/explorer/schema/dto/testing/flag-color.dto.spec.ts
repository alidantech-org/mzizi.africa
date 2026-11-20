import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { FlagColorDto } from "#/modules/explorer/schema/dto/flag-color.dto.ts";
import { flagColorExample } from "@test/modules/explorer/schema/dto/examples/flag-color.dto.example.ts";

/** Managed by Dryv: FlagColorDto enforces exactly what the FlagColor contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(FlagColorDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = flagColorExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("FlagColorDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(flagColorExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...flagColorExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
