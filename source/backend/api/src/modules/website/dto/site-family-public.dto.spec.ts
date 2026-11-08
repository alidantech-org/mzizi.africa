import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { SiteFamilyPublicDto } from "#/modules/website/dto/site-family-public.dto.ts";
import { siteFamilyPublicExample } from "#/modules/website/dto/site-family-public.dto.example.ts";

/** Managed by Dryv: SiteFamilyPublicDto enforces exactly what the SiteFamilyPublic contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(SiteFamilyPublicDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = siteFamilyPublicExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("SiteFamilyPublicDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(siteFamilyPublicExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...siteFamilyPublicExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});