import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { AllowancesDto } from "#/modules/auth/schema/dto/allowances.dto.ts";
import { allowancesExample } from "@test/modules/auth/schema/dto/examples/allowances.dto.example.ts";

/** Managed by Dryv: AllowancesDto enforces exactly what the Allowances contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(AllowancesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = allowancesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("AllowancesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(allowancesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...allowancesExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
