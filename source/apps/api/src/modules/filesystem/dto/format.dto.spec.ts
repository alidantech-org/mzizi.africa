import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { FormatDto } from "#/modules/filesystem/dto/format.dto.ts";
import { formatExample } from "#/modules/filesystem/dto/format.dto.example.ts";

/** Managed by Dryv: FormatDto enforces exactly what the Format contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(FormatDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = formatExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("FormatDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(formatExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...formatExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});