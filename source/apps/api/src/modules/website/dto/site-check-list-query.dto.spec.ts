import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { SiteCheckListQueryDto } from "#/modules/website/dto/site-check-list-query.dto.ts";
import { siteCheckListQueryExample } from "#/modules/website/dto/site-check-list-query.dto.example.ts";

/** Managed by Dryv: SiteCheckListQueryDto enforces exactly what the SiteCheckListQuery contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(SiteCheckListQueryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = siteCheckListQueryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("SiteCheckListQueryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(siteCheckListQueryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...siteCheckListQueryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});