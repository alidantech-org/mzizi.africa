import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { EntityLocationsListResponseDto } from "#/modules/entities/dto/entity-locations-list-response.dto.ts";
import { entityLocationsListResponseExample } from "#/modules/entities/dto/entity-locations-list-response.dto.example.ts";

/** Managed by Dryv: EntityLocationsListResponseDto enforces exactly what the EntityLocationsListResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(EntityLocationsListResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = entityLocationsListResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("EntityLocationsListResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(entityLocationsListResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...entityLocationsListResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});