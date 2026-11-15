import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { MemberWindowDto } from "#/modules/reference/schema/dto/member-window.dto.ts";
import { memberWindowExample } from "#/modules/reference/schema/dto/examples/member-window.dto.example.ts";

/** Managed by Dryv: MemberWindowDto enforces exactly what the MemberWindow contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(MemberWindowDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = memberWindowExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("MemberWindowDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(memberWindowExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...memberWindowExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});