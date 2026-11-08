import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CaptureSummaryDto } from "#/modules/pipeline/dto/capture-summary.dto.ts";
import { captureSummaryExample } from "#/modules/pipeline/dto/capture-summary.dto.example.ts";

/** Managed by Dryv: CaptureSummaryDto enforces exactly what the CaptureSummary contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(CaptureSummaryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = captureSummaryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("CaptureSummaryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(captureSummaryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...captureSummaryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});