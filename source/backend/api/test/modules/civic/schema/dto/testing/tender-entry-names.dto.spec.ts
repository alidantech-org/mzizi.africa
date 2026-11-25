import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { TenderEntryNamesDto } from "#/modules/civic/schema/dto/tender-entry-names.dto.ts";
import { tenderEntryNamesExample } from "@test/modules/civic/schema/dto/examples/tender-entry-names.dto.example.ts";

/** Managed by Dryv: TenderEntryNamesDto enforces exactly what the TenderEntryNames contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(TenderEntryNamesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = tenderEntryNamesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("TenderEntryNamesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(tenderEntryNamesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...tenderEntryNamesExample.valid(),
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
