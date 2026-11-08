import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { SiteMemberListQueryDto } from "#/modules/website/dto/site-member-list-query.dto.ts";
import { siteMemberListQueryExample } from "#/modules/website/dto/site-member-list-query.dto.example.ts";

/** Managed by Dryv: SiteMemberListQueryDto enforces exactly what the SiteMemberListQuery contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(SiteMemberListQueryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = siteMemberListQueryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("SiteMemberListQueryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(siteMemberListQueryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...siteMemberListQueryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});