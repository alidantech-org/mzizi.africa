import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { SiteFamilyListQueryDto } from "#/modules/website/dto/site-family-list-query.dto.ts";
import { siteFamilyListQueryExample } from "#/modules/website/dto/site-family-list-query.dto.example.ts";

/** Managed by Dryv: SiteFamilyListQueryDto enforces exactly what the SiteFamilyListQuery contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(SiteFamilyListQueryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = siteFamilyListQueryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("SiteFamilyListQueryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(siteFamilyListQueryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...siteFamilyListQueryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});