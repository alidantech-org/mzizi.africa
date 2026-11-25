import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { OutlineEntryDto } from "#/modules/geography/schema/dto/outline-entry.dto.ts";
import { outlineEntryExample } from "@test/modules/geography/schema/dto/examples/outline-entry.dto.example.ts";

/** Managed by Dryv: OutlineEntryDto enforces exactly what the OutlineEntry contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(OutlineEntryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = outlineEntryExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("OutlineEntryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(outlineEntryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...outlineEntryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
