import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { MemberKeyDto } from "#/modules/reference/dto/member-key.dto.ts";
import { memberKeyExample } from "#/modules/reference/dto/examples/member-key.dto.example.ts";

/** Managed by Dryv: MemberKeyDto enforces exactly what the MemberKey contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(MemberKeyDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = memberKeyExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("MemberKeyDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(memberKeyExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...memberKeyExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});