import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CoalitionDto } from "#/modules/ledger/schema/dto/coalition.dto.ts";
import { coalitionExample } from "@test/modules/ledger/schema/dto/examples/coalition.dto.example.ts";

/** Managed by Dryv: CoalitionDto enforces exactly what the Coalition contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(CoalitionDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = coalitionExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("CoalitionDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(coalitionExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...coalitionExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
