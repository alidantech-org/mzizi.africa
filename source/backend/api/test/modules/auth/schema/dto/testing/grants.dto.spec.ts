import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { GrantsDto } from "#/modules/auth/schema/dto/grants.dto.ts";
import { grantsExample } from "@test/modules/auth/schema/dto/examples/grants.dto.example.ts";

/** Managed by Dryv: GrantsDto enforces exactly what the Grants contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(GrantsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = grantsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("GrantsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(grantsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...grantsExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
