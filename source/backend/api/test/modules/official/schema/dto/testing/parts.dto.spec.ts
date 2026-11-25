import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PartsDto } from "#/modules/official/schema/dto/parts.dto.ts";
import { partsExample } from "@test/modules/official/schema/dto/examples/parts.dto.example.ts";

/** Managed by Dryv: PartsDto enforces exactly what the Parts contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PartsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = partsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("PartsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(partsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...partsExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
