import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ValueDto } from "#/modules/reference/schema/dto/value.dto.ts";
import { valueExample } from "@test/modules/reference/schema/dto/examples/value.dto.example.ts";

/** Managed by Dryv: ValueDto enforces exactly what the Value contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ValueDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = valueExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ValueDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(valueExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...valueExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
