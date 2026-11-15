import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { MembershipsDto } from "#/modules/auth/dto/memberships.dto.ts";
import { membershipsExample } from "#/modules/auth/dto/examples/memberships.dto.example.ts";

/** Managed by Dryv: MembershipsDto enforces exactly what the Memberships contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(MembershipsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = membershipsExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("MembershipsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(membershipsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...membershipsExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});