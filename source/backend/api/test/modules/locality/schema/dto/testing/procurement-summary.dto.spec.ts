import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ProcurementSummaryDto } from "#/modules/locality/schema/dto/procurement-summary.dto.ts";
import { procurementSummaryExample } from "@test/modules/locality/schema/dto/examples/procurement-summary.dto.example.ts";

/** Managed by Dryv: ProcurementSummaryDto enforces exactly what the ProcurementSummary contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ProcurementSummaryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = procurementSummaryExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ProcurementSummaryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(procurementSummaryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...procurementSummaryExample.valid(),
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
