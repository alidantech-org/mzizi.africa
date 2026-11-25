import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { TermEntryDto } from "#/modules/vocabulary/schema/dto/term-entry.dto.ts";
import { termEntryExample } from "@test/modules/vocabulary/schema/dto/examples/term-entry.dto.example.ts";

/** Managed by Dryv: TermEntryDto enforces exactly what the TermEntry contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(TermEntryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = termEntryExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("TermEntryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(termEntryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...termEntryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
