import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { GeometryWindowDto } from "#/modules/geography/schema/dto/geometry-window.dto.ts";
import { geometryWindowExample } from "@test/modules/geography/schema/dto/examples/geometry-window.dto.example.ts";

/** Managed by Dryv: GeometryWindowDto enforces exactly what the GeometryWindow contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(GeometryWindowDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = geometryWindowExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("GeometryWindowDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(geometryWindowExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...geometryWindowExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
