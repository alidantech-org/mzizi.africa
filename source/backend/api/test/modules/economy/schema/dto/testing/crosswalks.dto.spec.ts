import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CrosswalksDto } from "#/modules/economy/schema/dto/crosswalks.dto.ts";
import { crosswalksExample } from "@test/modules/economy/schema/dto/examples/crosswalks.dto.example.ts";

/** Managed by Dryv: CrosswalksDto enforces exactly what the Crosswalks contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(CrosswalksDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = crosswalksExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("CrosswalksDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(crosswalksExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...crosswalksExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
