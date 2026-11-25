import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { SiteKeyDto } from "#/modules/product/schema/dto/site-key.dto.ts";
import { siteKeyExample } from "@test/modules/product/schema/dto/examples/site-key.dto.example.ts";

/** Managed by Dryv: SiteKeyDto enforces exactly what the SiteKey contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(SiteKeyDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = siteKeyExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("SiteKeyDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(siteKeyExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...siteKeyExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
