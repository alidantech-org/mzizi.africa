import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { SitePublicDto } from "#/modules/website/dto/site-public.dto.ts";
import { sitePublicExample } from "#/modules/website/dto/site-public.dto.example.ts";

/** Managed by Dryv: SitePublicDto enforces exactly what the SitePublic contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(SitePublicDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = sitePublicExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("SitePublicDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(sitePublicExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...sitePublicExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});