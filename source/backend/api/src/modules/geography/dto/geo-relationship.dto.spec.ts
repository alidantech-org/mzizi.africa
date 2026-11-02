import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { GeoRelationshipDto } from "#/modules/geography/dto/geo-relationship.dto.ts";
import { geoRelationshipExample } from "#/modules/geography/dto/geo-relationship.dto.example.ts";

/** Managed by Dryv: GeoRelationshipDto enforces exactly what the GeoRelationship contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(GeoRelationshipDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = geoRelationshipExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("GeoRelationshipDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(geoRelationshipExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...geoRelationshipExample.valid(),
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
