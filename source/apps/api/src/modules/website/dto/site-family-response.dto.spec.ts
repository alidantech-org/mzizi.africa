import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { SiteFamilyResponseDto } from "#/modules/website/dto/site-family-response.dto.ts";
import { siteFamilyResponseExample } from "#/modules/website/dto/site-family-response.dto.example.ts";

/** Managed by Dryv: SiteFamilyResponseDto enforces exactly what the SiteFamilyResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(SiteFamilyResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = siteFamilyResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("SiteFamilyResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(siteFamilyResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...siteFamilyResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});