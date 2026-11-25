import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { EraEntryDto } from "#/modules/history/schema/dto/era-entry.dto.ts";
import { eraEntryExample } from "@test/modules/history/schema/dto/examples/era-entry.dto.example.ts";

/** Managed by Dryv: EraEntryDto enforces exactly what the EraEntry contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(EraEntryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = eraEntryExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("EraEntryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(eraEntryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...eraEntryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
