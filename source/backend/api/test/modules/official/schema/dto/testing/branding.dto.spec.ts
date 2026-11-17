import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { BrandingDto } from "#/modules/official/schema/dto/branding.dto.ts";
import { brandingExample } from "@test/modules/official/schema/dto/examples/branding.dto.example.ts";

/** Managed by Dryv: BrandingDto enforces exactly what the Branding contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(BrandingDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = brandingExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("BrandingDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(brandingExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...brandingExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
