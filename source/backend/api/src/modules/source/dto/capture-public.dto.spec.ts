import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CapturePublicDto } from "#/modules/source/dto/capture-public.dto.ts";
import { capturePublicExample } from "#/modules/source/dto/capture-public.dto.example.ts";

/** Managed by Dryv: CapturePublicDto enforces exactly what the CapturePublic contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(CapturePublicDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = capturePublicExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("CapturePublicDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(capturePublicExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...capturePublicExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});