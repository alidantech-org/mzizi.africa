import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { EntityLocationResponseDto } from "#/modules/entities/dto/entity-location-response.dto.ts";
import { entityLocationResponseExample } from "#/modules/entities/dto/entity-location-response.dto.example.ts";

/** Managed by Dryv: EntityLocationResponseDto enforces exactly what the EntityLocationResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(EntityLocationResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = entityLocationResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("EntityLocationResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(entityLocationResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...entityLocationResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});