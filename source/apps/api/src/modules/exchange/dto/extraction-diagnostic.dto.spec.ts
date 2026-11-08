import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ExtractionDiagnosticDto } from "#/modules/exchange/dto/extraction-diagnostic.dto.ts";
import { extractionDiagnosticExample } from "#/modules/exchange/dto/extraction-diagnostic.dto.example.ts";

/** Managed by Dryv: ExtractionDiagnosticDto enforces exactly what the ExtractionDiagnostic contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ExtractionDiagnosticDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = extractionDiagnosticExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("ExtractionDiagnosticDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(extractionDiagnosticExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...extractionDiagnosticExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});