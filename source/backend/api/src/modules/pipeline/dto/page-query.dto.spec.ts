import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PageQueryDto } from "#/modules/pipeline/dto/page-query.dto.ts";
import { pageQueryExample } from "#/modules/pipeline/dto/page-query.dto.example.ts";

/** Managed by Dryv: PageQueryDto enforces exactly what the PageQuery contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PageQueryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = pageQueryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("PageQueryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(pageQueryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...pageQueryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});