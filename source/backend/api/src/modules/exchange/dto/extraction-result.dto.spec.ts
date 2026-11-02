import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ExtractionResultDto } from "#/modules/exchange/dto/extraction-result.dto.ts";
import { extractionResultExample } from "#/modules/exchange/dto/extraction-result.dto.example.ts";

/** Managed by Dryv: ExtractionResultDto enforces exactly what the ExtractionResult contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ExtractionResultDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = extractionResultExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("ExtractionResultDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(extractionResultExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...extractionResultExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});