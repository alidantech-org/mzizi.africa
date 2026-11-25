import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { TermEntryLabelsDto } from "#/modules/vocabulary/schema/dto/term-entry-labels.dto.ts";
import { termEntryLabelsExample } from "@test/modules/vocabulary/schema/dto/examples/term-entry-labels.dto.example.ts";

/** Managed by Dryv: TermEntryLabelsDto enforces exactly what the TermEntryLabels contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(TermEntryLabelsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = termEntryLabelsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("TermEntryLabelsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(termEntryLabelsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...termEntryLabelsExample.valid(),
        unexpectedField: 1,
      }),
    ).toContain("unexpectedField");
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
