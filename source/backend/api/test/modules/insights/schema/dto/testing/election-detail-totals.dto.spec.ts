import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ElectionDetailTotalsDto } from "#/modules/insights/schema/dto/election-detail-totals.dto.ts";
import { electionDetailTotalsExample } from "@test/modules/insights/schema/dto/examples/election-detail-totals.dto.example.ts";

/** Managed by Dryv: ElectionDetailTotalsDto enforces exactly what the ElectionDetailTotals contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ElectionDetailTotalsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = electionDetailTotalsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ElectionDetailTotalsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(electionDetailTotalsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...electionDetailTotalsExample.valid(),
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
