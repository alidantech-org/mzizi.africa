import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { SiteTraitPublicDto } from "#/modules/website/dto/site-trait-public.dto.ts";
import { siteTraitPublicExample } from "#/modules/website/dto/site-trait-public.dto.example.ts";

/** Managed by Dryv: SiteTraitPublicDto enforces exactly what the SiteTraitPublic contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(SiteTraitPublicDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = siteTraitPublicExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("SiteTraitPublicDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(siteTraitPublicExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...siteTraitPublicExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});