import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { SchemeEntryDto } from "#/modules/reference/schema/dto/scheme-entry.dto.ts";
import { schemeEntryExample } from "@test/modules/reference/schema/dto/examples/scheme-entry.dto.example.ts";

/** Managed by Dryv: SchemeEntryDto enforces exactly what the SchemeEntry contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(SchemeEntryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = schemeEntryExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("SchemeEntryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(schemeEntryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...schemeEntryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
