import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CoalitionsDto } from "#/modules/politics/schema/dto/coalitions.dto.ts";
import { coalitionsExample } from "@test/modules/politics/schema/dto/examples/coalitions.dto.example.ts";

/** Managed by Dryv: CoalitionsDto enforces exactly what the Coalitions contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(CoalitionsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = coalitionsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("CoalitionsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(coalitionsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...coalitionsExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
