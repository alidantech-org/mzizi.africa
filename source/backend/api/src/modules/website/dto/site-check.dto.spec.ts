import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { SiteCheckDto } from "#/modules/website/dto/site-check.dto.ts";
import { siteCheckExample } from "#/modules/website/dto/site-check.dto.example.ts";

/** Managed by Dryv: SiteCheckDto enforces exactly what the SiteCheck contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(SiteCheckDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = siteCheckExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("SiteCheckDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(siteCheckExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...siteCheckExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});