import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { FactRowDto } from "#/modules/experience/schema/dto/fact-row.dto.ts";
import { factRowExample } from "@test/modules/experience/schema/dto/examples/fact-row.dto.example.ts";

/** Managed by Dryv: FactRowDto enforces exactly what the FactRow contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(FactRowDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = factRowExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("FactRowDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(factRowExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...factRowExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
