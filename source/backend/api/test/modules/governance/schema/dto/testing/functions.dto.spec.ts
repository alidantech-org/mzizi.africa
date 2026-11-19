import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { FunctionsDto } from "#/modules/governance/schema/dto/functions.dto.ts";
import { functionsExample } from "@test/modules/governance/schema/dto/examples/functions.dto.example.ts";

/** Managed by Dryv: FunctionsDto enforces exactly what the Functions contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(FunctionsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = functionsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("FunctionsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(functionsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...functionsExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
