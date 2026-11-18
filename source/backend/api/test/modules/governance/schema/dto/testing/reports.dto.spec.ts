import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ReportsDto } from "#/modules/governance/schema/dto/reports.dto.ts";
import { reportsExample } from "@test/modules/governance/schema/dto/examples/reports.dto.example.ts";

/** Managed by Dryv: ReportsDto enforces exactly what the Reports contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ReportsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = reportsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ReportsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(reportsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...reportsExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
