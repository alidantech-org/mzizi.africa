import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { SiteTraitListQueryDto } from "#/modules/website/dto/site-trait-list-query.dto.ts";
import { siteTraitListQueryExample } from "#/modules/website/dto/site-trait-list-query.dto.example.ts";

/** Managed by Dryv: SiteTraitListQueryDto enforces exactly what the SiteTraitListQuery contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(SiteTraitListQueryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = siteTraitListQueryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("SiteTraitListQueryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(siteTraitListQueryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...siteTraitListQueryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});