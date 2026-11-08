import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { SiteTraitDto } from "#/modules/website/dto/site-trait.dto.ts";
import { siteTraitExample } from "#/modules/website/dto/site-trait.dto.example.ts";

/** Managed by Dryv: SiteTraitDto enforces exactly what the SiteTrait contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(SiteTraitDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = siteTraitExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("SiteTraitDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(siteTraitExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...siteTraitExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});