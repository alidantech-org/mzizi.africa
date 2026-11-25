import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PowerEntryDto } from "#/modules/governance/schema/dto/power-entry.dto.ts";
import { powerEntryExample } from "@test/modules/governance/schema/dto/examples/power-entry.dto.example.ts";

/** Managed by Dryv: PowerEntryDto enforces exactly what the PowerEntry contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PowerEntryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = powerEntryExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("PowerEntryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(powerEntryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...powerEntryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
