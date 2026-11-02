import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { SiteMemberDto } from "#/modules/website/dto/site-member.dto.ts";
import { siteMemberExample } from "#/modules/website/dto/site-member.dto.example.ts";

/** Managed by Dryv: SiteMemberDto enforces exactly what the SiteMember contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(SiteMemberDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = siteMemberExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("SiteMemberDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(siteMemberExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...siteMemberExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});