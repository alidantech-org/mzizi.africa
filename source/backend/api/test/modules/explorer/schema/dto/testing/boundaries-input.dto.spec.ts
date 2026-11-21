import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { BoundariesInputDto } from "#/modules/explorer/schema/dto/boundaries-input.dto.ts";
import { boundariesInputExample } from "@test/modules/explorer/schema/dto/examples/boundaries-input.dto.example.ts";

/** Managed by Dryv: BoundariesInputDto enforces exactly what the BoundariesInput contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(BoundariesInputDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = boundariesInputExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("BoundariesInputDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(boundariesInputExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...boundariesInputExample.valid(),
        unexpectedField: 1,
      }),
    ).toContain("unexpectedField");
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
