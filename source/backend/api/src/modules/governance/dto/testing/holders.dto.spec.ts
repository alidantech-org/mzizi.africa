import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { HoldersDto } from "#/modules/governance/dto/holders.dto.ts";
import { holdersExample } from "#/modules/governance/dto/examples/holders.dto.example.ts";

/** Managed by Dryv: HoldersDto enforces exactly what the Holders contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(HoldersDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = holdersExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("HoldersDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(holdersExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...holdersExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});