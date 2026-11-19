import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { TenderListSummaryByStatusDto } from "#/modules/insights/schema/dto/tender-list-summary-by-status.dto.ts";
import { tenderListSummaryByStatusExample } from "@test/modules/insights/schema/dto/examples/tender-list-summary-by-status.dto.example.ts";

/** Managed by Dryv: TenderListSummaryByStatusDto enforces exactly what the TenderListSummaryByStatus contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(TenderListSummaryByStatusDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = tenderListSummaryByStatusExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("TenderListSummaryByStatusDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(tenderListSummaryByStatusExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...tenderListSummaryByStatusExample.valid(),
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
