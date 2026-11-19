import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { TenderListSummaryTransparencyDto } from "#/modules/insights/schema/dto/tender-list-summary-transparency.dto.ts";
import { tenderListSummaryTransparencyExample } from "@test/modules/insights/schema/dto/examples/tender-list-summary-transparency.dto.example.ts";

/** Managed by Dryv: TenderListSummaryTransparencyDto enforces exactly what the TenderListSummaryTransparency contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(TenderListSummaryTransparencyDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = tenderListSummaryTransparencyExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("TenderListSummaryTransparencyDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(tenderListSummaryTransparencyExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...tenderListSummaryTransparencyExample.valid(),
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
