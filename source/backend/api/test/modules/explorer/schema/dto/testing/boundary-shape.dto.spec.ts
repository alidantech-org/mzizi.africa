import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { BoundaryShapeDto } from "#/modules/explorer/schema/dto/boundary-shape.dto.ts";
import { boundaryShapeExample } from "@test/modules/explorer/schema/dto/examples/boundary-shape.dto.example.ts";

/** Managed by Dryv: BoundaryShapeDto enforces exactly what the BoundaryShape contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(BoundaryShapeDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = boundaryShapeExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("BoundaryShapeDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(boundaryShapeExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...boundaryShapeExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
