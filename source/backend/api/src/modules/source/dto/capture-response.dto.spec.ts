import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CaptureResponseDto } from "#/modules/source/dto/capture-response.dto.ts";
import { captureResponseExample } from "#/modules/source/dto/capture-response.dto.example.ts";

/** Managed by Dryv: CaptureResponseDto enforces exactly what the CaptureResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(CaptureResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = captureResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("CaptureResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(captureResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...captureResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});