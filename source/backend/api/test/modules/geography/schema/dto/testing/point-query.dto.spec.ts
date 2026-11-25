import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PointQueryDto } from "#/modules/geography/schema/dto/point-query.dto.ts";
import { pointQueryExample } from "@test/modules/geography/schema/dto/examples/point-query.dto.example.ts";

/** Managed by Dryv: PointQueryDto enforces exactly what the PointQuery contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PointQueryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = pointQueryExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("PointQueryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(pointQueryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...pointQueryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
