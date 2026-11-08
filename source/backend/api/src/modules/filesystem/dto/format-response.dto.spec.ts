import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { FormatResponseDto } from "#/modules/filesystem/dto/format-response.dto.ts";
import { formatResponseExample } from "#/modules/filesystem/dto/format-response.dto.example.ts";

/** Managed by Dryv: FormatResponseDto enforces exactly what the FormatResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(FormatResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = formatResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("FormatResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(formatResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...formatResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});