import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { SiteDetailDto } from "#/modules/product/schema/dto/site-detail.dto.ts";
import { siteDetailExample } from "@test/modules/product/schema/dto/examples/site-detail.dto.example.ts";

/** Managed by Dryv: SiteDetailDto enforces exactly what the SiteDetail contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(SiteDetailDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = siteDetailExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("SiteDetailDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(siteDetailExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...siteDetailExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
