import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { MotionDetailLegalFiscalYearDto } from "#/modules/insights/schema/dto/motion-detail-legal-fiscal-year.dto.ts";
import { motionDetailLegalFiscalYearExample } from "@test/modules/insights/schema/dto/examples/motion-detail-legal-fiscal-year.dto.example.ts";

/** Managed by Dryv: MotionDetailLegalFiscalYearDto enforces exactly what the MotionDetailLegalFiscalYear contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(MotionDetailLegalFiscalYearDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = motionDetailLegalFiscalYearExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("MotionDetailLegalFiscalYearDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(motionDetailLegalFiscalYearExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...motionDetailLegalFiscalYearExample.valid(),
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
