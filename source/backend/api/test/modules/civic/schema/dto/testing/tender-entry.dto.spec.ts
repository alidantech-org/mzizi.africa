import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { TenderEntryDto } from "#/modules/civic/schema/dto/tender-entry.dto.ts";
import { tenderEntryExample } from "@test/modules/civic/schema/dto/examples/tender-entry.dto.example.ts";

/** Managed by Dryv: TenderEntryDto enforces exactly what the TenderEntry contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(TenderEntryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = tenderEntryExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("TenderEntryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(tenderEntryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...tenderEntryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
