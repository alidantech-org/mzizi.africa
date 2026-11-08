import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { SiteRelationPublicDto } from "#/modules/website/dto/site-relation-public.dto.ts";
import { siteRelationPublicExample } from "#/modules/website/dto/site-relation-public.dto.example.ts";

/** Managed by Dryv: SiteRelationPublicDto enforces exactly what the SiteRelationPublic contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(SiteRelationPublicDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = siteRelationPublicExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("SiteRelationPublicDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(siteRelationPublicExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...siteRelationPublicExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});