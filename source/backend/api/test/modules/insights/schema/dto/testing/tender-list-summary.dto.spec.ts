import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { TenderListSummaryDto } from "#/modules/insights/schema/dto/tender-list-summary.dto.ts";
import { tenderListSummaryExample } from "@test/modules/insights/schema/dto/examples/tender-list-summary.dto.example.ts";

/** Managed by Dryv: TenderListSummaryDto enforces exactly what the TenderListSummary contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(TenderListSummaryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = tenderListSummaryExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("TenderListSummaryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(tenderListSummaryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...tenderListSummaryExample.valid(),
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
