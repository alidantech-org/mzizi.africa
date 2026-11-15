import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { MemberEntryDto } from "#/modules/reference/dto/member-entry.dto.ts";
import { memberEntryExample } from "#/modules/reference/dto/member-entry.dto.example.ts";

/** Managed by Dryv: MemberEntryDto enforces exactly what the MemberEntry contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(MemberEntryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = memberEntryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("MemberEntryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(memberEntryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...memberEntryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});