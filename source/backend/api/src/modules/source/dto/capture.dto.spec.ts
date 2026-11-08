import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CaptureDto } from "#/modules/source/dto/capture.dto.ts";
import { captureExample } from "#/modules/source/dto/capture.dto.example.ts";

/** Managed by Dryv: CaptureDto enforces exactly what the Capture contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(CaptureDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = captureExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("CaptureDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(captureExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...captureExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});