import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CoordinatesInputDto } from "#/modules/explorer/schema/dto/coordinates-input.dto.ts";
import { coordinatesInputExample } from "@test/modules/explorer/schema/dto/examples/coordinates-input.dto.example.ts";

/** Managed by Dryv: CoordinatesInputDto enforces exactly what the CoordinatesInput contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(CoordinatesInputDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = coordinatesInputExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("CoordinatesInputDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(coordinatesInputExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...coordinatesInputExample.valid(),
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
