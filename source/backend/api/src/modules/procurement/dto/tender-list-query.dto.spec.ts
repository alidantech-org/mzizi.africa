import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { TenderListQueryDto } from "#/modules/procurement/dto/tender-list-query.dto.ts";
import { tenderListQueryExample } from "#/modules/procurement/dto/tender-list-query.dto.example.ts";

/** Managed by Dryv: TenderListQueryDto enforces exactly what the TenderListQuery contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(TenderListQueryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = tenderListQueryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("TenderListQueryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(tenderListQueryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...tenderListQueryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});