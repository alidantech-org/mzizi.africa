import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { VintagePublicDto } from "#/modules/statistics/dto/vintage-public.dto.ts";
import { vintagePublicExample } from "#/modules/statistics/dto/vintage-public.dto.example.ts";

/** Managed by Dryv: VintagePublicDto enforces exactly what the VintagePublic contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(VintagePublicDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = vintagePublicExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("VintagePublicDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(vintagePublicExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...vintagePublicExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});