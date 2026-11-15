import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { FoundMemberDto } from "#/modules/reference/schema/dto/found-member.dto.ts";
import { foundMemberExample } from "#/modules/reference/schema/dto/examples/found-member.dto.example.ts";

/** Managed by Dryv: FoundMemberDto enforces exactly what the FoundMember contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(FoundMemberDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = foundMemberExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("FoundMemberDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(foundMemberExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...foundMemberExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});