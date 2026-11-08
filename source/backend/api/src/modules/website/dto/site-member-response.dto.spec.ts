import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { SiteMemberResponseDto } from "#/modules/website/dto/site-member-response.dto.ts";
import { siteMemberResponseExample } from "#/modules/website/dto/site-member-response.dto.example.ts";

/** Managed by Dryv: SiteMemberResponseDto enforces exactly what the SiteMemberResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(SiteMemberResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = siteMemberResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("SiteMemberResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(siteMemberResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...siteMemberResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});