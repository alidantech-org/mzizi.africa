import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { SiteMembersListResponseDto } from "#/modules/website/dto/site-members-list-response.dto.ts";
import { siteMembersListResponseExample } from "#/modules/website/dto/site-members-list-response.dto.example.ts";

/** Managed by Dryv: SiteMembersListResponseDto enforces exactly what the SiteMembersListResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(SiteMembersListResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = siteMembersListResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("SiteMembersListResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(siteMembersListResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...siteMembersListResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});