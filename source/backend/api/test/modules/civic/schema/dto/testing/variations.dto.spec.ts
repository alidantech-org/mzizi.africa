import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { VariationsDto } from "#/modules/civic/schema/dto/variations.dto.ts";
import { variationsExample } from "@test/modules/civic/schema/dto/examples/variations.dto.example.ts";

/** Managed by Dryv: VariationsDto enforces exactly what the Variations contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(VariationsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = variationsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("VariationsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(variationsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...variationsExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
