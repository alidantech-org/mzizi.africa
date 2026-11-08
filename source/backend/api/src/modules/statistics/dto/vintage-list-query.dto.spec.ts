import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { VintageListQueryDto } from "#/modules/statistics/dto/vintage-list-query.dto.ts";
import { vintageListQueryExample } from "#/modules/statistics/dto/vintage-list-query.dto.example.ts";

/** Managed by Dryv: VintageListQueryDto enforces exactly what the VintageListQuery contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(VintageListQueryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = vintageListQueryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("VintageListQueryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(vintageListQueryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...vintageListQueryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});