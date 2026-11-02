import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { OccupancyLinkDto } from "#/modules/place/dto/occupancy-link.dto.ts";
import { occupancyLinkExample } from "#/modules/place/dto/occupancy-link.dto.example.ts";

/** Managed by Dryv: OccupancyLinkDto enforces exactly what the OccupancyLink contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(OccupancyLinkDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = occupancyLinkExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("OccupancyLinkDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(occupancyLinkExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...occupancyLinkExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});