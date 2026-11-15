import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ApisDto } from "#/modules/source/dto/apis.dto.ts";
import { apisExample } from "#/modules/source/dto/apis.dto.example.ts";

/** Managed by Dryv: ApisDto enforces exactly what the Apis contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ApisDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = apisExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("ApisDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(apisExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...apisExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});