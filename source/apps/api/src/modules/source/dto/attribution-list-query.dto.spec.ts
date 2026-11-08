import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { AttributionListQueryDto } from "#/modules/source/dto/attribution-list-query.dto.ts";
import { attributionListQueryExample } from "#/modules/source/dto/attribution-list-query.dto.example.ts";

/** Managed by Dryv: AttributionListQueryDto enforces exactly what the AttributionListQuery contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(AttributionListQueryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = attributionListQueryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("AttributionListQueryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(attributionListQueryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...attributionListQueryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});