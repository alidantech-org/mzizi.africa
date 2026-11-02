import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { SiteCheckPublicDto } from "#/modules/website/dto/site-check-public.dto.ts";
import { siteCheckPublicExample } from "#/modules/website/dto/site-check-public.dto.example.ts";

/** Managed by Dryv: SiteCheckPublicDto enforces exactly what the SiteCheckPublic contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(SiteCheckPublicDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = siteCheckPublicExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("SiteCheckPublicDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(siteCheckPublicExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...siteCheckPublicExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});