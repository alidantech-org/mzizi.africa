import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { FundsDto } from "#/modules/finance/schema/dto/funds.dto.ts";
import { fundsExample } from "@test/modules/finance/schema/dto/examples/funds.dto.example.ts";

/** Managed by Dryv: FundsDto enforces exactly what the Funds contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(FundsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = fundsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("FundsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(fundsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...fundsExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
