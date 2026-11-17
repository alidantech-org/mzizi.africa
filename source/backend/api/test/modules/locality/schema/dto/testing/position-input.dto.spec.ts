import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PositionInputDto } from "#/modules/locality/schema/dto/position-input.dto.ts";
import { positionInputExample } from "@test/modules/locality/schema/dto/examples/position-input.dto.example.ts";

/** Managed by Dryv: PositionInputDto enforces exactly what the PositionInput contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PositionInputDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = positionInputExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("PositionInputDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(positionInputExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...positionInputExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
