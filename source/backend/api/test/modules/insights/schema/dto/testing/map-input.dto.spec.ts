import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { MapInputDto } from "#/modules/insights/schema/dto/map-input.dto.ts";
import { mapInputExample } from "@test/modules/insights/schema/dto/examples/map-input.dto.example.ts";

/** Managed by Dryv: MapInputDto enforces exactly what the MapInput contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(MapInputDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = mapInputExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("MapInputDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(mapInputExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...mapInputExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
