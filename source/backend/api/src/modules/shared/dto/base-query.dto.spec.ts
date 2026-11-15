import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { BaseQueryDto } from "#/modules/shared/dto/base-query.dto.ts";
import { baseQueryExample } from "#/modules/shared/dto/base-query.dto.example.ts";

/** Managed by Dryv: BaseQueryDto enforces exactly what the BaseQuery contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(BaseQueryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = baseQueryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("BaseQueryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(baseQueryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...baseQueryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});