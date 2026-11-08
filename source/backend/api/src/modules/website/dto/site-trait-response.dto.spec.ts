import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { SiteTraitResponseDto } from "#/modules/website/dto/site-trait-response.dto.ts";
import { siteTraitResponseExample } from "#/modules/website/dto/site-trait-response.dto.example.ts";

/** Managed by Dryv: SiteTraitResponseDto enforces exactly what the SiteTraitResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(SiteTraitResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = siteTraitResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("SiteTraitResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(siteTraitResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...siteTraitResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});