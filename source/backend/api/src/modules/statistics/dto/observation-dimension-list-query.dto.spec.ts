import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ObservationDimensionListQueryDto } from "#/modules/statistics/dto/observation-dimension-list-query.dto.ts";
import { observationDimensionListQueryExample } from "#/modules/statistics/dto/observation-dimension-list-query.dto.example.ts";

/** Managed by Dryv: ObservationDimensionListQueryDto enforces exactly what the ObservationDimensionListQuery contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ObservationDimensionListQueryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = observationDimensionListQueryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("ObservationDimensionListQueryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(observationDimensionListQueryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...observationDimensionListQueryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});