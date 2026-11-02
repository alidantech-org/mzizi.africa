import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { FormatListQueryDto } from "#/modules/filesystem/dto/format-list-query.dto.ts";
import { formatListQueryExample } from "#/modules/filesystem/dto/format-list-query.dto.example.ts";

/** Managed by Dryv: FormatListQueryDto enforces exactly what the FormatListQuery contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(FormatListQueryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = formatListQueryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("FormatListQueryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(formatListQueryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...formatListQueryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});